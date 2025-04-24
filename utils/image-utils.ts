import { cache } from "react"

export interface ImageData {
  url: string
  alt: string
  section: string
  description: string
}

type ImageMap = Record<string, ImageData>

// Cache the fetch to avoid multiple requests for the same data
export const getImageMap = cache(async (): Promise<ImageMap> => {
  try {
    const response = await fetch("/api/images/map", { next: { revalidate: 60 } })
    if (!response.ok) throw new Error("Failed to fetch image map")
    return await response.json()
  } catch (error) {
    console.error("Error fetching image map:", error)
    return {}
  }
})

export async function getImageByTag(tag: string): Promise<ImageData | null> {
  const imageMap = await getImageMap()
  return imageMap[tag] || null
}

export async function getAllImagesBySection(section: string): Promise<ImageData[]> {
  const imageMap = await getImageMap()
  return Object.values(imageMap).filter((image) => image.section === section)
}

export function getImageTags(): string[] {
  // This would typically be fetched from the server
  // For now, we'll return a static list of tags
  return [
    "logo",
    "hero-background",
    "gallery-common-area",
    "gallery-pool",
    "gallery-dormitory",
    "gallery-terrace",
    "gallery-kitchen",
    "gallery-private-room",
    "activity-wine-tasting",
    "activity-hiking",
    "activity-city-tour",
    "activity-cooking-class",
    "activity-bike-tour",
    "activity-hostel-party",
    "booking-wine-tasting",
    "booking-andes-trek",
    "booking-bike-tour",
    "booking-cooking-class",
    "booking-party",
    "booking-olive-oil",
  ]
}
