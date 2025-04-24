"use client"

import { useLanguage } from "@/contexts/language-context"
import ImageGallery from "./image-gallery"

export default function Activities() {
  const { t } = useLanguage()

  const activityItems = [
    {
      tag: "activity-wine-tasting",
      alt: t("activities.items.wineTasting"),
      title: t("activities.items.wineTasting"),
    },
    {
      tag: "activity-hiking",
      alt: t("activities.items.hiking"),
      title: t("activities.items.hiking"),
    },
    {
      tag: "activity-city-tour",
      alt: t("activities.items.cityTour"),
      title: t("activities.items.cityTour"),
    },
    {
      tag: "activity-cooking-class",
      alt: t("activities.items.cookingClass"),
      title: t("activities.items.cookingClass"),
    },
    {
      tag: "activity-bike-tour",
      alt: t("activities.items.bikeTour"),
      title: t("activities.items.bikeTour"),
    },
    {
      tag: "activity-hostel-party",
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
