import { NextResponse } from "next/server"
import { put, list } from "@vercel/blob"
import { DEFAULT_IMAGE_MAPPING } from "@/config/default-image-mapping"

// The key for our image mapping in Vercel Blob
const IMAGE_MAPPING_KEY = "data/image-mapping.json"

/**
 * GET endpoint to retrieve the image mapping from Vercel Blob
 */
export async function GET() {
  try {
    // Try to get the image mapping from Vercel Blob
    const { blobs } = await list({ prefix: IMAGE_MAPPING_KEY })
    const blobInfo = blobs.find(b => b.pathname === IMAGE_MAPPING_KEY)

    if (blobInfo) {
      // If the blob exists, get its content
      const response = await fetch(blobInfo.url)
      const text = await response.text()
      try {
        const mapping = JSON.parse(text)
        return NextResponse.json(mapping)
      } catch (parseError) {
        console.error("Error parsing image mapping JSON:", parseError)
        // If parsing fails, create a new mapping
        await createDefaultMapping()
        return NextResponse.json(DEFAULT_IMAGE_MAPPING)
      }
    } else {
      // If the blob doesn't exist, create it with default mapping
      console.log("Image mapping blob not found, creating default mapping...")
      await createDefaultMapping()
      return NextResponse.json(DEFAULT_IMAGE_MAPPING)
    }
  } catch (error) {
    console.error(
      "Error retrieving image mapping from blob:",
      error instanceof Error ? error.message : String(error),
      error instanceof Error && error.stack ? `\nStack: ${error.stack}` : "",
    )

    // If there's an error, try to create the default mapping
    try {
      await createDefaultMapping()
    } catch (createError) {
      console.error("Error creating default mapping:", createError)
    }

    return NextResponse.json(DEFAULT_IMAGE_MAPPING)
  }
}

/**
 * POST endpoint to update the image mapping in Vercel Blob
 */
export async function POST(request: Request) {
  try {
    const mapping = await request.json()

    // Convert the mapping to a JSON string
    const mappingString = JSON.stringify(mapping, null, 2)

    // Upload the mapping to Vercel Blob
    await put(IMAGE_MAPPING_KEY, mappingString, {
      access: "public",
      contentType: "application/json",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating image mapping in blob:", error)
    return NextResponse.json({ error: "Failed to update image mapping" }, { status: 500 })
  }
}

/**
 * Helper function to create the default mapping if it doesn't exist
 */
async function createDefaultMapping() {
  try {
    const mappingString = JSON.stringify(DEFAULT_IMAGE_MAPPING, null, 2)

    await put(IMAGE_MAPPING_KEY, mappingString, {
      access: "public",
      contentType: "application/json",
    })

    return true
  } catch (error) {
    console.error("Error creating default mapping:", error)
    return false
  }
}
