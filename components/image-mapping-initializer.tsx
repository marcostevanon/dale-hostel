"use client"

import { useEffect, useState } from "react"
import { DEFAULT_IMAGE_MAPPING } from "@/services/image-service"

export default function ImageMappingInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    async function initializeImageMapping() {
      try {
        // Try to fetch the image mapping
        const response = await fetch("/api/blob/image-mapping")

        // If the response is not successful, create the mapping
        if (!response.ok) {
          console.log("Image mapping not found, creating default mapping...")

          // Create the default mapping
          await fetch("/api/blob/image-mapping", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(DEFAULT_IMAGE_MAPPING),
          })
        }

        setInitialized(true)
      } catch (error) {
        console.error("Error initializing image mapping:", error)

        // Try to create the mapping even if there was an error
        try {
          await fetch("/api/blob/image-mapping", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(DEFAULT_IMAGE_MAPPING),
          })
          setInitialized(true)
        } catch (createError) {
          console.error("Error creating default mapping:", createError)
        }
      }
    }

    initializeImageMapping()
  }, [])

  // This component doesn't render anything visible
  return null
}
