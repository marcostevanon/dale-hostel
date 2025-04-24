import { NextResponse } from "next/server"

// Helper function to get the image mapping from blob
async function getImageMapping() {
  try {
    const response = await fetch(
      new URL("/api/blob/image-mapping", process.env.VERCEL_URL || "http://localhost:3000").toString(),
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch image map: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error reading image mapping:", error)
    return {}
  }
}

// Helper function to save the image mapping to blob
async function saveImageMapping(mapping: any) {
  try {
    const response = await fetch(
      new URL("/api/blob/image-mapping", process.env.VERCEL_URL || "http://localhost:3000").toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mapping),
      },
    )

    return response.ok
  } catch (error) {
    console.error("Error saving image mapping:", error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { tag, imageData } = await request.json()

    if (!tag || !imageData || !imageData.url) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Get current mapping
    const mapping = await getImageMapping()

    // Update the mapping
    mapping[tag] = {
      url: imageData.url,
      alt: imageData.alt || "",
      section: imageData.section || "general",
      description: imageData.description || "",
    }

    // Save the updated mapping
    const success = await saveImageMapping(mapping)

    if (success) {
      return NextResponse.json({ success: true, tag, imageData: mapping[tag] })
    } else {
      return NextResponse.json({ error: "Failed to save image mapping" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating image mapping:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get("tag")

    if (!tag) {
      return NextResponse.json({ error: "Tag parameter is required" }, { status: 400 })
    }

    // Get current mapping
    const mapping = await getImageMapping()

    // Check if tag exists
    if (!mapping[tag]) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Remove the tag
    delete mapping[tag]

    // Save the updated mapping
    const success = await saveImageMapping(mapping)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to save image mapping" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting image mapping:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
