"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { logError } from "@/utils/error-logger"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    logError(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">We've been notified about this issue and we'll take a look at it shortly.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-primary hover:bg-primary-dark text-white">
            Try again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go back home
          </Button>
        </div>
      </div>
    </div>
  )
}
