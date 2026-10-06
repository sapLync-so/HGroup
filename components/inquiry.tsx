"use client"

import { useState } from "react"
import { propertyInquiryNote } from "@/lib/property-inquiry"
import type { Property } from "@/lib/properties"

type Status = "idle" | "submitting" | "sent" | "error"

export function Inquiry({
  id = "book",
  heading = "Inquiry",
  copy = "Leave a name and a way to reply. We read every message.",
  submitLabel = "Send inquiry",
  properties,
  selectedPropertyId,
  tone = "default",
}: {
  id?: string
  heading?: string
  copy?: string
  submitLabel?: string
  properties?: Property[]
  selectedPropertyId?: string | null
  tone?: "default" | "hgroup"
}) {
  const styles =
    tone === "hgroup"
      ? {
          sectionBorder: "border-[var(--hg-line)]",
          heading: "text-[var(--hg-ink)]",
          copy: "text-[var(--hg-muted)]",
          field:
            "w-full min-w-0 border border-[var(--hg-line)] bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-[var(--hg-teal-ui)]",
          helper: "text-[var(--hg-teal-ui)]",
          submit:
            "hg-btn-primary w-fit rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60",
        }
      : {
          sectionBorder: "border-[#e6dccb]",
          heading: "",
          copy: "text-[#5c534c]",
          field: "w-full min-w-0 border border-[#e6dccb] bg-white px-3 py-2",
          helper: "text-[#8a7040]",
          submit:
            "gold-gradient w-fit rounded-full px-5 py-2.5 text-sm font-semibold text-[#1a1614] disabled:opacity-60",
        }

  const [status, setStatus] = useState<Status>("idle")
  const [propertyId, setPropertyId] = useState<string>(selectedPropertyId ?? "")
  const [lastPropId, setLastPropId] = useState<string | null | undefined>(selectedPropertyId)

  if (selectedPropertyId !== undefined && selectedPropertyId !== lastPropId) {
    setLastPropId(selectedPropertyId)
    setPropertyId(selectedPropertyId ?? "")
  }

  const selectedProperty = properties?.find((property) => property.id === propertyId)

  if (status === "sent") {
    return (
      <section id={id} className={`border-t ${styles.sectionBorder} py-16`}>
        <h2 className={`font-display text-4xl font-semibold${styles.heading ? ` ${styles.heading}` : ""}`}>{heading}</h2>
        <p className={`mt-3 max-w-xl ${styles.copy}`}>
          Sent — thank you. We will reply shortly.
        </p>
      </section>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    try {
      const data = new FormData(event.currentTarget)
      data.set("source_page", window.location.pathname)
      if (selectedProperty) {
        data.set(
          "note",
          propertyInquiryNote(String(data.get("note") ?? ""), selectedProperty),
        )
      }
      const res = await fetch("/api/inquiry", {
        method: "POST",
        body: data,
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id={id} className={`border-t ${styles.sectionBorder} py-16`}>
      <h2 className={`font-display text-4xl font-semibold${styles.heading ? ` ${styles.heading}` : ""}`}>{heading}</h2>
      <p className={`mt-3 max-w-xl ${styles.copy}`}>{copy}</p>
      <form className="mt-8 grid max-w-xl gap-4" onSubmit={handleSubmit}>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        {properties && properties.length > 0 && (
          <label className="grid min-w-0 gap-1 text-sm">
            Which home?
            <select
              value={propertyId}
              onChange={(event) => setPropertyId(event.target.value)}
              className={styles.field}
            >
              <option value="">General inquiry</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} ({property.inquiryReference}) — Ask About Availability
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="grid min-w-0 gap-1 text-sm">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            className={styles.field}
          />
        </label>
        <label className="grid min-w-0 gap-1 text-sm">
          Contact
          <input
            name="contact"
            required
            autoComplete="email"
            className={styles.field}
          />
        </label>
        <label className="grid min-w-0 gap-1 text-sm">
          Note
          <textarea
            name="note"
            rows={4}
            className={styles.field}
          />
        </label>
        {selectedProperty && (
          <p className={`text-xs ${styles.helper}`}>
            Your note will be sent with a reference to {selectedProperty.name} (
            {selectedProperty.inquiryReference}).
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-700">
            Something did not go through. Please try again.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className={styles.submit}
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>
      </form>
    </section>
  )
}
