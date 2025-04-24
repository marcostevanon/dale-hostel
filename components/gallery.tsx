"use client"

import { useLanguage } from "@/contexts/language-context"
import ImageGallery from "./image-gallery"
import { GALLERY_IMAGES } from "@/constants/image-tags"

export default function Gallery() {
  const { t } = useLanguage()

  // Map the gallery image tags to gallery items with translations
  const galleryItems = GALLERY_IMAGES.map((tag) => {
    // Extract the space name from the tag (e.g., "gallery-common-area" -> "commonArea")
    const spaceName = tag.replace("gallery-", "").replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

    return {
      tag,
      alt: t(`gallery.spaces.${spaceName}`),
      title: t(`gallery.spaces.${spaceName}`),
    }
  })

  return (
    <ImageGallery
      title={t("gallery.title")}
      description={t("gallery.description")}
      items={galleryItems}
      className="bg-secondary"
    />
  )
}
