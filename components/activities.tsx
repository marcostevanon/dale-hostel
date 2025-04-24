"use client"

import { useLanguage } from "@/contexts/language-context"
import ImageGallery from "./image-gallery"

export default function Activities() {
  const { t } = useLanguage()

  const activityItems = [
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("activities.items.wineTasting"),
      title: t("activities.items.wineTasting"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("activities.items.hiking"),
      title: t("activities.items.hiking"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("activities.items.cityTour"),
      title: t("activities.items.cityTour"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("activities.items.cookingClass"),
      title: t("activities.items.cookingClass"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("activities.items.bikeTour"),
      title: t("activities.items.bikeTour"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("activities.items.hostelParty"),
      title: t("activities.items.hostelParty"),
    },
  ]

  return (
    <ImageGallery
      title={t("activities.title")}
      description={t("activities.description")}
      items={activityItems}
      className="bg-white"
      id="activities"
    />
  )
}
