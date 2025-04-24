import { put, get } from "@vercel/blob"

// The key for our image mapping in Vercel Blob
const IMAGE_MAPPING_KEY = "data/image-mapping.json"

// Default image mapping with essential images
const DEFAULT_MAPPING = {
  logo: {
    url: "/dale-logo.png",
    alt: "Dale Hostel Logo",
    section: "navbar",
    description: "Logo for Dale Hostel",
  },
  "hero-background": {
    url: "/modern-hostel-facade.png",
    alt: "Dale Hostel exterior view",
    section: "hero",
    description: "Main background image for the hero section",
  },
}

/**
 * This script ensures that the image mapping exists in Vercel Blob
 * It should be run during the build process
 */
async function ensureImageMapping() {
  try {
    console.log("Checking if image mapping exists in Vercel Blob...")

    // Try to get the existing mapping
    const blob = await get(IMAGE_MAPPING_KEY)

    if (!blob) {
      console.log("Image mapping not found. Creating default mapping...")

      // Create the default mapping
      const mappingString = JSON.stringify(DEFAULT_MAPPING, null, 2)

      await put(IMAGE_MAPPING_KEY, mappingString, {
        access: "public",
        contentType: "application/json",
      })

      console.log("Default image mapping created successfully.")
    } else {
      console.log("Image mapping already exists in Vercel Blob.")
    }
  } catch (error) {
    console.error("Error ensuring image mapping:", error)
  }
}

// Run the script
ensureImageMapping()
  .then(() => console.log("Image mapping check completed."))
  .catch((error) => console.error("Error running script:", error))
