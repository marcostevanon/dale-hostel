import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    // List all blobs
    const { blobs } = await list()

    // Add category information based on pathname
    const images = blobs.map((blob) => {
      // Extract category from pathname (e.g., "gallery/image.jpg" -> "gallery")
      const pathParts = blob.pathname.split("/")
      const category = pathParts.length > 1 ? pathParts[0] : "other"

      return {
        ...blob,
        category,
      }
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error listing images:", error)
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 })
  }
}
