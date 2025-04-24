import { DEFAULT_IMAGE_MAPPING, DEFAULT_IMAGES, type ImageData, type ImageMap } from "@/config/default-image-mapping"
import { IMAGE_TAGS } from "@/constants/image-tags"
import { logError } from "@/utils/error-logger"
import { cache } from "react"

// Cache the fetch to avoid multiple requests for the same data
export const getImageMap = cache(async (): Promise<ImageMap> => {
  try {
    // First try to get from the blob API
    const response = await fetch("/api/images/map", {
      next: { revalidate: 60 },
      // Prevent caching issues during development
      cache: "no-store",
    })

    if (!response.ok) {
      console.warn(`Failed to fetch image map from API: ${response.status} ${response.statusText}`)
      return DEFAULT_IMAGE_MAPPING
    }

    const data = await response.json()
    return data || DEFAULT_IMAGE_MAPPING
  } catch (error) {
    console.warn(
      "Error fetching image map, using fallback mapping:",
      error instanceof Error ? error.message : String(error),
    )
    return DEFAULT_IMAGE_MAPPING
  }
})

export async function getImageByTag(tag: string): Promise<ImageData | null> {
  try {
    const imageMap = await getImageMap()
    return imageMap[tag] || null
  } catch (error) {
    logError(error instanceof Error ? error : new Error(`Error getting image for tag: ${tag}`))
    return null
  }
}

export async function getAllImagesBySection(section: string): Promise<ImageData[]> {
  try {
    const imageMap = await getImageMap()
    return Object.values(imageMap).filter((image) => image.section === section)
  } catch (error) {
    logError(error instanceof Error ? error : new Error(`Error getting images for section: ${section}`))
    return []
  }
}

// Helper function to get a fallback URL for a specific tag
export function getFallbackForTag(tag: string): string {
  // Common fallbacks based on the tag structure
  if (tag === IMAGE_TAGS.SITE.LOGO) return DEFAULT_IMAGES.LOGO
  if (tag === IMAGE_TAGS.SITE.HERO_BACKGROUND) return DEFAULT_IMAGES.HERO_BG

  // Generate a placeholder based on the tag name
  const query = tag.replace(/-/g, "%20")
  return `/placeholder.svg?height=600&width=800&query=${query}`
}

// Get all available image tags from our constants
export function getImageTags(): string[] {
  const allTags: string[] = []

  // Recursively collect all tag values from the IMAGE_TAGS object
  function collectTags(obj: any) {
    Object.values(obj).forEach((value) => {
      if (typeof value === "string") {
        allTags.push(value)
      } else if (Array.isArray(value)) {
        value.forEach((tag) => allTags.push(tag))
      } else if (typeof value === "object" && value !== null) {
        collectTags(value)
      }
    })
  }

  collectTags(IMAGE_TAGS)
  return allTags
}
