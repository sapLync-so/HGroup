import { Resend } from "resend"
import { createServiceClient } from "@/lib/supabase"

const TO_EMAIL = "info@hgroup.rentals"
const TABLE = "hgroup_inquiries"

const LIMITS = { name: 200, contact: 200, note: 2000 } as const

function clean(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  // Honeypot: bots fill this hidden field; humans never see it.
  if (formData.get("website")) {
    return Response.json({ ok: true })
  }

  const name = clean(formData.get("name"), LIMITS.name)
  const contact = clean(formData.get("contact"), LIMITS.contact)
  const note = clean(formData.get("note"), LIMITS.note)
  const sourcePage = clean(formData.get("source_page"), 200) || "/"

  if (!name || !contact) {
    return Response.json({ error: "Name and contact are required" }, { status: 400 })
  }
  if (sourcePage !== "/" && sourcePage !== "/portfolio-preview") {
    return Response.json({ error: "Invalid source page" }, { status: 400 })
  }

  let supabase: ReturnType<typeof createServiceClient>
  let inquiryId: string
  try {
    supabase = createServiceClient()
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ name, contact, note: note || null, source_page: sourcePage })
      .select("id")
      .single()
    if (error || !data?.id) throw new Error("Could not save inquiry")
    inquiryId = data.id
  } catch {
    console.error("inquiry: database insert failed")
    return Response.json({ error: "Could not save inquiry" }, { status: 500 })
  }

  let emailStatus: "sent" | "failed" = "failed"
  try {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !from) throw new Error("Email configuration is missing")
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from,
      to: TO_EMAIL,
      ...(/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact) ? { replyTo: contact } : {}),
      subject: `New H Group inquiry from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `Name: ${name}\nContact: ${contact}\nSource: ${sourcePage}\n\n${note || "(no note)"}`,
    })
    if (error || !data?.id) throw new Error("Email was not accepted")
    emailStatus = "sent"
  } catch {
    // The row is already stored; don't lose the inquiry over email failure.
    console.error("inquiry: email send failed")
  }

  try {
    const { error } = await supabase
      .from(TABLE)
      .update({ email_status: emailStatus })
      .eq("id", inquiryId)
    if (error) throw new Error("Could not update email status")
  } catch {
    console.error("inquiry: email status update failed")
  }

  return Response.json({ ok: true, emailStatus })
}
