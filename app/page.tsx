import type { Metadata } from "next"
import { PortfolioPreview } from "@/components/portfolio/portfolio-preview"
import "./portfolio-preview/portfolio-preview.css"

export const metadata: Metadata = {
  title: "H Group Rentals — Homes for rent, shown as they stand",
  description:
    "Explore H Group's rental-home portfolio through real photography: the featured brick residence, room-by-room views, and a clear path to request a tour.",
}

export default function Home() {
  return <PortfolioPreview />
}
