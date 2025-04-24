"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logWarning } from "@/utils/error-logger"

export default function NotFound() {
  useEffect(() => {
    // Log 404 errors
    logWarning(`404 Not Found: ${window.location.pathname}`)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <Button asChild className="bg-primary hover:bg-primary-dark text-white">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}
