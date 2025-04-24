import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = (formData.get("category") as string) || "other"

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

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
