"use client"

import { useCallback, useState } from "react"
import { properties, type Property } from "@/lib/properties"
import { StickyCta } from "@/components/sticky-cta"
import { PortfolioNav } from "./portfolio-nav"
import { PortfolioHero } from "./portfolio-hero"
import { PortfolioProperties } from "./portfolio-properties"
import { PropertyDetailDialog } from "./property-detail-dialog"
import { RoomViewer } from "./room-viewer"
import { StagingGallery } from "./staging-gallery"
import { PortfolioCta } from "./portfolio-cta"
import { PortfolioFooter } from "./portfolio-footer"

export function PortfolioPreview() {
  const [openProperty, setOpenProperty] = useState<Property | null>(null)
  const [inquiryPropertyId, setInquiryPropertyId] = useState<string | null>(null)

  const featured = properties.find((property) => property.featured) ?? properties[0]
  const tourRooms =
    featured?.virtualTour?.kind === "photo-sequence" ? featured.virtualTour.rooms : []

  const inquire = useCallback((property: Property) => {
    setInquiryPropertyId(property.id)
    setOpenProperty(null)
    requestAnimationFrame(() => {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })
    })
  }, [])

  const closeDialog = useCallback(() => setOpenProperty(null), [])

  return (
    <div className="bg-[#f7f3ec] text-[#1a1614]">
      <PortfolioNav />
      <PortfolioHero property={featured} />
      <main>
        <PortfolioProperties
          properties={properties}
          onView={setOpenProperty}
          onInquire={inquire}
        />
        <RoomViewer rooms={tourRooms} propertyName={featured?.name ?? "This home"} />
        <StagingGallery photos={featured?.stagedGallery ?? []} />
        <PortfolioCta properties={properties} selectedPropertyId={inquiryPropertyId} />
      </main>
      <PortfolioFooter />
      <StickyCta />
      <PropertyDetailDialog
        property={openProperty}
        onClose={closeDialog}
        onInquire={inquire}
      />
    </div>
  )
}
