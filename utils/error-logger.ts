export function logError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error.message, {
    error,
    stack: error.stack,
    ...context,
  })
}

/**
 * Log a warning message
 * @param message The warning message
 * @param context Additional context information
 */
export function logWarning(message: string, context?: Record<string, any>) {
  console.warn("Warning:", message, context)
}
