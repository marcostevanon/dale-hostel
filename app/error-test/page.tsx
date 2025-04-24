"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { logError } from "@/utils/error-logger"

export default function ErrorTestPage() {
  const [errorType, setErrorType] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const triggerError = () => {
    setErrorMessage("")

    try {
      if (errorType === "reference") {
        // This will cause a reference error
        // @ts-ignore - Intentional error
        const undefinedVariable = null
        console.log(undefinedVariable?.property)
      } else if (errorType === "type") {
        // This will cause a type error
        // @ts-ignore - Intentional error
        const num = null
        console.log(num.toFixed(2))
      } else if (errorType === "api") {
        // Simulate an API error
        throw new Error("API Error: Failed to fetch data")
      } else if (errorType === "unhandled") {
        // This will cause an unhandled promise rejection
        Promise.reject(new Error("Unhandled Promise Rejection"))
      } else {
        // Manual error with timestamp to make it unique
        throw new Error(`Manual error triggered for testing: ${new Date().toISOString()}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        // Log to console for debugging
        logError(error, {
          errorType,
          page: "error-test",
          timestamp: new Date().toISOString(),
        })

        // Show success message
        setErrorMessage(`Error successfully logged: ${error.message}`)
      }
    }
  }

  // This function will cause an unhandled error outside the try/catch
  const triggerUnhandledError = () => {
    // This will throw outside of a try/catch
    setTimeout(() => {
      // @ts-ignore - Intentional error
      const obj = null
      obj.nonExistentMethod()
    }, 100)

    setErrorMessage("Unhandled error triggered. Check console for logs.")
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Error Test Page</h1>
      <p className="mb-6">This page allows you to test error logging by triggering different types of errors.</p>

      <div className="space-y-6 max-w-md">
        <div>
          <h2 className="text-xl font-semibold mb-2">Select Error Type</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="errorType"
                value="reference"
                checked={errorType === "reference"}
                onChange={() => setErrorType("reference")}
              />
              <span>Reference Error (undefined variable)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="errorType"
                value="type"
                checked={errorType === "type"}
                onChange={() => setErrorType("type")}
              />
              <span>Type Error (null object)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="errorType"
                value="api"
                checked={errorType === "api"}
                onChange={() => setErrorType("api")}
              />
              <span>API Error (simulated fetch error)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="errorType"
                value="unhandled"
                checked={errorType === "unhandled"}
                onChange={() => setErrorType("unhandled")}
              />
              <span>Unhandled Promise Rejection</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="errorType"
                value="manual"
                checked={errorType === "manual"}
                onChange={() => setErrorType("manual")}
              />
              <span>Manual Error (throw new Error)</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button onClick={triggerError} disabled={!errorType} className="bg-primary hover:bg-primary-dark text-white">
            Trigger Handled Error
          </Button>

          <Button onClick={triggerUnhandledError} variant="destructive">
            Trigger Unhandled Error
          </Button>
        </div>

        {errorMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-700">{errorMessage}</p>
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            <strong>Note:</strong> After triggering errors, check your browser console to see if they were captured.
          </p>
        </div>
      </div>
    </div>
  )
}
