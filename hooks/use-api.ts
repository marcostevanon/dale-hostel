"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useApi<T>() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApi = async <R = T>(url: string, options?: RequestInit, apiOptions?: ApiOptions<R>): Promise<R | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as R

      if (apiOptions?.successMessage) {
        toast({
          title: "Success",
          description: apiOptions.successMessage,
        })
      }

      apiOptions?.onSuccess?.(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"

      setError(errorMessage)

      toast({
        title: "Error",
        description: apiOptions?.errorMessage || errorMessage,
        variant: "destructive",
      })

      apiOptions?.onError?.(err instanceof Error ? err : new Error(errorMessage))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    setError,
    fetchApi,
  }
}
