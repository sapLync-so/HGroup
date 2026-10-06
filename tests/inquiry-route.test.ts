import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import ts from "typescript"

const source = readFileSync(new URL("../app/api/inquiry/route.ts", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function harness(options: { databaseError?: boolean; emailError?: boolean; updateError?: boolean; missingKey?: boolean; missingSender?: boolean } = {}) {
  const inserts: Array<{ table: string; row: Record<string, unknown> }> = []
  const updates: Array<{ table: string; row: Record<string, unknown>; column: string; id: string }> = []
  const emails: Array<Record<string, unknown>> = []
  const logs: unknown[][] = []
  const id = "00000000-0000-4000-8000-000000000001"
  const client = {
    from(table: string) {
      return {
        insert(row: Record<string, unknown>) {
          inserts.push({ table, row })
          const result = { data: options.databaseError ? null : { id }, error: options.databaseError ? { message: "private database detail" } : null }
          return Object.assign(Promise.resolve(result), { select: () => ({ single: async () => result }) })
        },
        update(row: Record<string, unknown>) {
          return { eq: async (column: string, value: string) => {
            updates.push({ table, row, column, id: value })
            return { error: options.updateError ? { message: "private update detail" } : null }
          } }
        },
      }
    },
  }
  class Resend {
    emails = { send: async (message: Record<string, unknown>) => {
      emails.push(message)
      return options.emailError
        ? { data: null, error: { message: "private provider detail" } }
        : { data: { id: "test-email" }, error: null }
    } }
  }
  const exports: { POST?: (request: Request) => Promise<Response> } = {}
  runInNewContext(compiled, {
    exports, Response, Request,
    process: { env: {
      RESEND_API_KEY: options.missingKey ? undefined : "test-placeholder-not-a-key",
      RESEND_FROM_EMAIL: options.missingSender ? undefined : "H Group <inquiries@example.com>",
    } },
    console: { error: (...args: unknown[]) => logs.push(args) },
    require: (name: string) => {
      if (name === "resend") return { Resend }
      if (name === "@/lib/supabase") return { createServiceClient: () => client }
      throw new Error(`Unexpected dependency: ${name}`)
    },
  })
  return { post: exports.POST!, inserts, updates, emails, logs, id }
}

function request(values: Record<string, string> = {}) {
  const form = new FormData()
  for (const [key, value] of Object.entries({ name: " Test Visitor ", contact: "visitor@example.com", note: "Tour request", source_page: "/portfolio-preview", ...values })) form.set(key, value)
  return new Request("http://localhost/api/inquiry", { method: "POST", body: form })
}

test("inquiry writes only to the H Group table and records its source page", async () => {
  const h = harness()
  const response = await h.post(request())
  assert.equal(response.status, 200)
  assert.equal(h.inserts.length, 1)
  assert.equal(h.inserts[0].table, "hgroup_inquiries")
  assert.equal(h.inserts[0].row.name, "Test Visitor")
  assert.equal(h.inserts[0].row.source_page, "/portfolio-preview")
  assert.equal(h.emails[0].to, "info@hgroup.rentals")
  assert.equal(h.emails[0].from, "H Group <inquiries@example.com>")
  assert.equal(h.emails[0].replyTo, "visitor@example.com")
  assert.equal(h.updates[0].table, "hgroup_inquiries")
  assert.equal(h.updates[0].row.email_status, "sent")
  assert.equal(h.updates[0].column, "id")
  assert.equal(h.updates[0].id, h.id)
  assert.deepEqual(await response.json(), { ok: true, emailStatus: "sent" })
})

test("phone contact is saved without an invalid email replyTo", async () => {
  const h = harness()
  await h.post(request({ contact: "555-0100" }))
  assert.equal(h.inserts[0].row.contact, "555-0100")
  assert.equal(h.emails[0].replyTo, undefined)
  assert.match(String(h.emails[0].text), /555-0100/)
})

test("email failure preserves inquiry and marks only that row failed without logging private details", async () => {
  const h = harness({ emailError: true })
  const response = await h.post(request())
  assert.equal(response.status, 200)
  assert.equal(h.inserts.length, 1)
  assert.equal(h.updates[0]?.row.email_status, "failed")
  assert.equal(h.updates[0]?.id, h.id)
  assert.deepEqual(await response.json(), { ok: true, emailStatus: "failed" })
  assert.doesNotMatch(JSON.stringify(h.logs), /private provider detail/)
})

for (const option of ["missingKey", "missingSender"] as const) {
  test(`${option} saves inquiry but does not attempt email`, async () => {
    const h = harness({ [option]: true })
    const response = await h.post(request())
    assert.equal(response.status, 200)
    assert.equal(h.inserts.length, 1)
    assert.equal(h.emails.length, 0)
    assert.equal(h.updates[0]?.row.email_status, "failed")
  })
}

test("database failure returns an error, sends no email and does not log record details", async () => {
  const h = harness({ databaseError: true })
  assert.equal((await h.post(request())).status, 500)
  assert.equal(h.emails.length, 0)
  assert.equal(h.updates.length, 0)
  assert.doesNotMatch(JSON.stringify(h.logs), /private database detail/)
})

test("email status write failure does not invite duplicate inquiry submissions", async () => {
  const h = harness({ updateError: true })
  assert.equal((await h.post(request())).status, 200)
  assert.equal(h.inserts.length, 1)
  assert.equal(h.emails.length, 1)
  assert.ok(h.logs.length > 0)
  assert.doesNotMatch(JSON.stringify(h.logs), /private update detail/)
})

test("honeypot returns success without saving or sending", async () => {
  const h = harness()
  assert.equal((await h.post(request({ website: "spam" }))).status, 200)
  assert.equal(h.inserts.length, 0)
  assert.equal(h.emails.length, 0)
})

const invalidFields: Array<Record<string, string>> = [{ name: " " }, { contact: "" }, { source_page: "https://unrelated.example/" }]
for (const values of invalidFields) {
  test(`invalid fields rejected: ${JSON.stringify(values)}`, async () => {
    const h = harness()
    assert.equal((await h.post(request(values))).status, 400)
    assert.equal(h.inserts.length, 0)
    assert.equal(h.emails.length, 0)
  })
}

test("legacy submissions default to baseline source and enforce existing length limits", async () => {
  const h = harness()
  await h.post(request({ source_page: "", name: "N".repeat(250), contact: "C".repeat(250), note: "X".repeat(2500) }))
  assert.equal(h.inserts[0].row.source_page, "/")
  assert.equal(String(h.inserts[0].row.name).length, 200)
  assert.equal(String(h.inserts[0].row.contact).length, 200)
  assert.equal(String(h.inserts[0].row.note).length, 2000)
})

test("malformed request body is rejected before services are used", async () => {
  const h = harness()
  const response = await h.post(new Request("http://localhost/api/inquiry", { method: "POST", body: "not form data" }))
  assert.equal(response.status, 400)
  assert.equal(h.inserts.length, 0)
})
