"use client"

import { useLanguage } from "@/contexts/language-context"
import ImageGallery from "./image-gallery"

export default function Gallery() {
  const { t } = useLanguage()

  const galleryItems = [
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("gallery.spaces.commonArea"),
      title: t("gallery.spaces.commonArea"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("gallery.spaces.pool"),
      title: t("gallery.spaces.pool"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("gallery.spaces.dormitory"),
      title: t("gallery.spaces.dormitory"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("gallery.spaces.terrace"),
      title: t("gallery.spaces.terrace"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("gallery.spaces.kitchen"),
      title: t("gallery.spaces.kitchen"),
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: t("gallery.spaces.privateRoom"),
      title: t("gallery.spaces.privateRoom"),
    },
  ]

  return (
    <ImageGallery
      title={t("gallery.title")}
      description={t("gallery.description")}
      items={galleryItems}
      className="bg-gray-50"
    />
  )
}
