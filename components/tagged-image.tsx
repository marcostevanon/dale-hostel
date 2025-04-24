"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getImageByTag, getFallbackForTag } from "@/services/image-service"
import { logError } from "@/utils/error-logger"

interface TaggedImageProps {
  tag: string
  fallbackSrc?: string
  alt?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  style?: React.CSSProperties
}

export default function TaggedImage({
  tag,
  fallbackSrc,
  alt = "",
  className = "",
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  style,
}: TaggedImageProps) {
  // Use the tag-specific fallback if no fallbackSrc is provided
  const defaultFallback = fallbackSrc || getFallbackForTag(tag)

  const [imageSrc, setImageSrc] = useState<string>(defaultFallback)
  const [imageAlt, setImageAlt] = useState<string>(alt || tag.replace(/-/g, " "))
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function loadImage() {
      try {
        setIsLoading(true)
        const imageData = await getImageByTag(tag)
        if (imageData && imageData.url) {
          setImageSrc(imageData.url)
          // Use provided alt text or fall back to the one from metadata
          setImageAlt(alt || imageData.alt || tag.replace(/-/g, " "))
        } else {
          console.log(`No image data found for tag "${tag}", using fallback`)
          // If no image data, use the fallback
          setImageSrc(defaultFallback)
        }
      } catch (error) {
        setHasError(true)
        setImageSrc(defaultFallback)

        if (error instanceof Error) {
          console.error(`Error loading image with tag "${tag}":`, error.message)
          logError(error, { tag, fallbackSrc: defaultFallback })
        } else {
          console.error(`Error loading image with tag "${tag}":`, error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [tag, alt, defaultFallback])

  // Common image props
  const imageProps = {
    src: imageSrc,
    alt: imageAlt,
    className: `${className} ${isLoading ? "animate-pulse" : ""} ${hasError ? "opacity-80" : ""}`,
    priority,
    style,
    // Add error handling
    onError: () => {
      if (imageSrc !== defaultFallback) {
        setImageSrc(defaultFallback)
        setHasError(true)
      }
    },
  }

  return fill ? (
    <Image {...imageProps} fill sizes={sizes} />
  ) : (
    <Image {...imageProps} width={width || 800} height={height || 600} sizes={sizes} />
  )
}
