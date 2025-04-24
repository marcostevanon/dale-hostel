import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = (formData.get("category") as string) || "other"
    const tag = formData.get("tag") as string
    const alt = (formData.get("alt") as string) || ""
    const section = (formData.get("section") as string) || category
    const description = (formData.get("description") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Create a clean filename
    const originalName = file.name
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase()

    // Add category as a folder prefix
    const pathname = `${category}/${Date.now()}-${cleanName}`

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
    })

    // If a tag was provided, update the image mapping
    if (tag) {
      // Get current mapping
      const mappingResponse = await fetch(
        new URL("/api/blob/image-mapping", process.env.VERCEL_URL || "http://localhost:3000").toString(),
      )
      const mapping = await mappingResponse.json()

      // Update the mapping
      mapping[tag] = {
        url: blob.url,
        alt: alt || tag.replace(/-/g, " "),
        section: section,
        description: description || `Image for ${tag}`,
      }

      // Save the updated mapping
      await fetch(new URL("/api/blob/image-mapping", process.env.VERCEL_URL || "http://localhost:3000").toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mapping),
      })
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      tag: tag || null,
    })
  } catch (error) {
    console.error("Error uploading and mapping image:", error)
    return NextResponse.json({ error: "Failed to upload and map image" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
