import { NextResponse } from "next/server"
import { DEFAULT_IMAGE_MAPPING } from "@/config/default-image-mapping"

export async function GET() {
  try {
    // Add more comprehensive error handling
    const apiUrl = new URL("/api/blob/image-mapping", process.env.VERCEL_URL || "http://localhost:3000").toString()
    console.log(`Attempting to fetch image map from: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      // Add cache: 'no-store' to prevent caching issues during development
      cache: "no-store",
    })

    if (!response.ok) {
      console.warn(`Failed to fetch image map from blob: ${response.status} ${response.statusText}`)
      // Return the default mapping instead of an error to prevent breaking the UI
      return NextResponse.json(DEFAULT_IMAGE_MAPPING)
    }

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data)
    } catch (parseError) {
      console.error("Error parsing image map JSON:", parseError)
      return NextResponse.json(DEFAULT_IMAGE_MAPPING)
    }
  } catch (error) {
    console.error("Error fetching image map:", error instanceof Error ? error.message : String(error))
    // Return the default mapping instead of an error to prevent breaking the UI
    return NextResponse.json(DEFAULT_IMAGE_MAPPING)
  }
}
