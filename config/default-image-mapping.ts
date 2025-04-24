export interface ImageData {
  url: string
  alt: string
  section: string
  description: string
}

export type ImageMap = Record<string, ImageData>

// Default image configuration
export const DEFAULT_IMAGES = {
  LOGO: "/dale-logo.png",
  HERO_BG: "/modern-hostel-facade.png",
  PLACEHOLDER: "/chromatic-explosion.png",
}

// Default image mapping to use as fallback
export const DEFAULT_IMAGE_MAPPING: ImageMap = {
  logo: {
    url: DEFAULT_IMAGES.LOGO,
    alt: "Dale Hostel Logo",
    section: "navbar",
    description: "Logo for Dale Hostel",
  },
  "hero-background": {
    url: DEFAULT_IMAGES.HERO_BG,
    alt: "Dale Hostel exterior view",
    section: "hero",
    description: "Main background image for the hero section",
  },
  "gallery-common-area": {
    url: "/vibrant-hostel-hangout.png",
    alt: "Common area with comfortable seating",
    section: "gallery",
    description: "Image of the hostel's common area",
  },
  "gallery-pool": {
    url: "/hostel-pool-gathering.png",
    alt: "Swimming pool with lounge chairs",
    section: "gallery",
    description: "Image of the hostel's pool area",
  },
  "gallery-dormitory": {
    url: "/cozy-hostel-dorm.png",
    alt: "Clean and modern dormitory",
    section: "gallery",
    description: "Image of the hostel's dormitory",
  },
  "gallery-terrace": {
    url: "/hostel-hangout.png",
    alt: "Terrace with mountain views",
    section: "gallery",
    description: "Image of the hostel's terrace",
  },
  "gallery-kitchen": {
    url: "/bustling-hostel-kitchen.png",
    alt: "Fully equipped kitchen",
    section: "gallery",
    description: "Image of the hostel's kitchen",
  },
  "gallery-private-room": {
    url: "/placeholder.svg?height=600&width=800&query=hostel%20private%20room",
    alt: "Comfortable private room",
    section: "gallery",
    description: "Image of the hostel's private room",
  },
  "activity-wine-tasting": {
    url: "/placeholder.svg?height=600&width=800&query=wine%20tasting%20mendoza",
    alt: "Wine tasting in Mendoza",
    section: "activities",
    description: "Image of wine tasting tour",
  },
  "activity-hiking": {
    url: "/placeholder.svg?height=600&width=800&query=hiking%20andes%20mountains",
    alt: "Hiking in the Andes mountains",
    section: "activities",
    description: "Image of hiking in the Andes",
  },
  "activity-city-tour": {
    url: "/placeholder.svg?height=600&width=800&query=mendoza%20city%20tour",
    alt: "Mendoza city tour",
    section: "activities",
    description: "Image of Mendoza city tour",
  },
  "activity-cooking-class": {
    url: "/placeholder.svg?height=600&width=800&query=argentine%20cooking%20class",
    alt: "Argentine cooking class",
    section: "activities",
    description: "Image of Argentine cooking class",
  },
  "activity-bike-tour": {
    url: "/placeholder.svg?height=600&width=800&query=bike%20tour%20mendoza",
    alt: "Bike tour in Mendoza",
    section: "activities",
    description: "Image of bike tour in Mendoza",
  },
  "activity-hostel-party": {
    url: "/placeholder.svg?height=600&width=800&query=hostel%20party",
    alt: "Hostel party night",
    section: "activities",
    description: "Image of hostel party",
  },
  "booking-wine-tasting": {
    url: "/placeholder.svg?height=600&width=800&query=wine%20tasting%20tour%20mendoza",
    alt: "Wine tasting tour",
    section: "booking",
    description: "Image for booking wine tasting tour",
  },
  "booking-andes-trek": {
    url: "/placeholder.svg?height=600&width=800&query=andes%20mountain%20trek",
    alt: "Andes mountain trek",
    section: "booking",
    description: "Image for booking Andes mountain trek",
  },
  "booking-bike-tour": {
    url: "/placeholder.svg?height=600&width=800&query=city%20bike%20tour%20mendoza",
    alt: "City bike tour",
    section: "booking",
    description: "Image for booking city bike tour",
  },
  "booking-cooking-class": {
    url: "/placeholder.svg?height=600&width=800&query=argentine%20cooking%20class",
    alt: "Cooking class",
    section: "booking",
    description: "Image for booking cooking class",
  },
  "booking-party": {
    url: "/placeholder.svg?height=600&width=800&query=hostel%20party%20night",
    alt: "Hostel party night",
    section: "booking",
    description: "Image for booking hostel party night",
  },
  "booking-olive-oil": {
    url: "/placeholder.svg?height=600&width=800&query=olive%20oil%20tasting%20mendoza",
    alt: "Olive oil tasting",
    section: "booking",
    description: "Image for booking olive oil tasting",
  },
}
