import { put, list } from "@vercel/blob"
import * as fs from "fs"

// The key for our image mapping in Vercel Blob
const DEFAULT_MAPPING = "data/image-mapping.json"

/**
 * This script ensures that the image mapping exists in Vercel Blob
 * It should be run during the build process
 */
export async function ensureImageMapping() {
  try {
    console.log("Checking if image mapping exists in Vercel Blob...")

    // Try to get the existing mapping
    const { blobs } = await list({ prefix: DEFAULT_MAPPING })
    const blob = blobs.find(b => b.pathname === DEFAULT_MAPPING)

    if (!blob) {
      console.log("Image mapping not found. Creating default mapping...")

      // Create the default mapping
      const mappingString = fs.readFileSync("data/image-mapping.json", "utf8")

      await put(DEFAULT_MAPPING, mappingString, {
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

// Run the script if it's called directly
if (require.main === module) {
  ensureImageMapping()
    .then(() => console.log("Image mapping check completed."))
    .catch((error) => console.error("Error running script:", error))
}
