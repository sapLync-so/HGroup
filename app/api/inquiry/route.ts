import { Resend } from "resend"
import { createServiceClient } from "@/lib/supabase"

const TO_EMAIL = "info@hgroupai.com"
const FROM_EMAIL = "HGroup Site <onboarding@resend.dev>"

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

  if (!name || !contact) {
    return Response.json({ error: "Name and contact are required" }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()
    const { error } = await supabase
      .from("inquiries")
      .insert({ name, contact, note: note || null })
    if (error) throw error
  } catch (error) {
    console.error("inquiry: database insert failed", error)
    return Response.json({ error: "Could not save inquiry" }, { status: 500 })
  }

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error("RESEND_API_KEY must be set")
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: contact,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\n\n${note || "(no note)"}`,
    })
    if (error) throw new Error(error.message)
  } catch (error) {
    // The row is already stored; don't lose the inquiry over email failure.
    console.error("inquiry: email send failed", error)
  }

  return Response.json({ ok: true })
}
