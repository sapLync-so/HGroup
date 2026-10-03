"use client"

import { useState } from "react"

export function Inquiry() {
  const [noted, setNoted] = useState(false)

  if (noted) {
    return (
      <section id="book" className="border-t border-[#e6dccb] py-16">
        <h2 className="font-display text-4xl font-semibold">Inquiry</h2>
        <p className="mt-3 max-w-xl text-[#5c534c]">
          Noted on this page only. Nothing was sent.
        </p>
      </section>
    )
  }

  return (
    <section id="book" className="border-t border-[#e6dccb] py-16">
      <h2 className="font-display text-4xl font-semibold">Inquiry</h2>
      <p className="mt-3 max-w-xl text-[#5c534c]">
        Leave a name and a way to reply. This form does not deliver a message
        yet.
      </p>
      <form
        className="mt-8 grid max-w-xl gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          setNoted(true)
        }}
      >
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
        <button
          type="submit"
          className="gold-gradient w-fit rounded-full px-5 py-2.5 text-sm font-semibold text-[#1a1614]"
        >
          Keep on this page
        </button>
      </form>
    </section>
  )
}
