import type { Property } from "./properties"

export function propertyInquiryNote(note: string, property?: Pick<Property, "name" | "inquiryReference">) {
  const prefix = property ? `Property: ${property.name} [${property.inquiryReference}]\n\n` : ""
  return `${prefix}${note.trim()}`.slice(0, 2000)
}
