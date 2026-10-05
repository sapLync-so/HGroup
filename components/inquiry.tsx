"use client"

import { useState } from "react"

type Status = "idle" | "submitting" | "sent" | "error"

export function Inquiry() {
  const [status, setStatus] = useState<Status>("idle")

  if (status === "sent") {
    return (
      <section id="book" className="border-t border-[#e6dccb] py-16">
        <h2 className="font-display text-4xl font-semibold">Inquiry</h2>
        <p className="mt-3 max-w-xl text-[#5c534c]">
          Sent — thank you. We will reply shortly.
        </p>
      </section>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        body: new FormData(event.currentTarget),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="book" className="border-t border-[#e6dccb] py-16">
      <h2 className="font-display text-4xl font-semibold">Inquiry</h2>
      <p className="mt-3 max-w-xl text-[#5c534c]">
        Leave a name and a way to reply. We read every message.
      </p>
      <form className="mt-8 grid max-w-xl gap-4" onSubmit={handleSubmit}>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <label className="grid gap-1 text-sm">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            className="border border-[#e6dccb] bg-white px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Contact
          <input
            name="contact"
            required
            autoComplete="email"
            className="border border-[#e6dccb] bg-white px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Note
          <textarea
            name="note"
            rows={4}
            className="border border-[#e6dccb] bg-white px-3 py-2"
          />
        </label>
        {status === "error" && (
          <p className="text-sm text-red-700">
            Something did not go through. Please try again.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="gold-gradient w-fit rounded-full px-5 py-2.5 text-sm font-semibold text-[#1a1614] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send inquiry"}
        </button>
      </form>
    </section>
  )
}
