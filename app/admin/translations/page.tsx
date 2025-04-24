"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Save, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
// Import the Pagination component
import { Pagination } from "@/components/ui/pagination"

type FlatTranslation = {
  key: string
  path: string
  en: string
  es: string
}

// Constants for pagination
const ITEMS_PER_PAGE = 10

export default function TranslationsAdmin() {
  const { toast } = useToast()

  const [translations, setTranslations] = useState<FlatTranslation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Load translations on component mount
  useEffect(() => {
    loadTranslations()
  }, [])

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Update the loadTranslations function to handle errors better
  const loadTranslations = async () => {
    setIsLoading(true)
    setError("")
    try {
      // Get English translations
      const enResponse = await fetch(`/api/admin/translations?language=en`)
      if (!enResponse.ok) {
        throw new Error(`Failed to load English translations: ${enResponse.statusText}`)
      }
      const enData = await enResponse.json()

      // Get Spanish translations
      const esResponse = await fetch(`/api/admin/translations?language=es`)
      if (!esResponse.ok) {
        throw new Error(`Failed to load Spanish translations: ${esResponse.statusText}`)
      }
      const esData = await esResponse.json()

      // Check if we have valid translation objects
      if (!enData.translations || !esData.translations) {
        throw new Error("Invalid translation data received from server")
      }

      // Flatten the translations
      const flatTranslations = flattenTranslations(enData.translations, esData.translations)
      setTranslations(flatTranslations)
    } catch (err) {
      console.error("Translation loading error:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred while loading translations"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Flatten nested translations into a simple array
  const flattenTranslations = (enObj: any, esObj: any, prefix = "") => {
    const result: FlatTranslation[] = []

    const processObject = (enObj: any, esObj: any, path: string) => {
      Object.keys(enObj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key

        if (typeof enObj[key] === "object" && enObj[key] !== null && !Array.isArray(enObj[key])) {
          // Recursively process nested objects
          processObject(enObj[key], esObj?.[key] || {}, newPath)
        } else if (Array.isArray(enObj[key])) {
          // Handle arrays (like booking.activities)
          enObj[key].forEach((item: any, index: number) => {
            if (typeof item === "object" && item !== null) {
              processObject(item, esObj?.[key]?.[index] || {}, `${newPath}.${index}`)
            } else {
              result.push({
                key: `${key}[${index}]`,
                path: `${newPath}.${index}`,
                en: item || "",
                es: esObj?.[key]?.[index] || "",
              })
            }
          })
        } else {
          // Add leaf nodes to result
          result.push({
            key,
            path: newPath,
            en: enObj[key] || "",
            es: esObj?.[key] || "",
          })
        }
      })
    }

    processObject(enObj, esObj, prefix)
    return result
  }

  // Update a translation value
  const updateTranslation = (index: number, language: "en" | "es", value: string) => {
    const newTranslations = [...translations]
    newTranslations[index][language] = value
    setTranslations(newTranslations)
  }

  // Rebuild nested structure from flat translations - memoized for performance
  const rebuildNestedStructure = (flatTranslations: FlatTranslation[], language: "en" | "es") => {
    const result: any = {}

    flatTranslations.forEach((item) => {
      const parts = item.path.split(".")
      let current = result

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]

        // Check if this part is an array index
        if (part.match(/^\d+$/)) {
          const index = Number.parseInt(part)
          if (!Array.isArray(current)) {
            current = []
          }
          if (!current[index]) {
            current[index] = {}
          }
          current = current[index]
        } else {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      }

      const lastPart = parts[parts.length - 1]
      current[lastPart] = item[language]
    })

    return result
  }

  // Save all translations
  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // Rebuild nested structures
      const enTranslations = rebuildNestedStructure(translations, "en")
      const esTranslations = rebuildNestedStructure(translations, "es")

      // Save English translations
      const enResponse = await fetch("/api/admin/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "en",
          translations: enTranslations,
        }),
      })

      // Save Spanish translations
      const esResponse = await fetch("/api/admin/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "es",
          translations: esTranslations,
        }),
      })

      if (enResponse.ok && esResponse.ok) {
        setSuccess("Translations saved successfully")
        toast({
          title: "Success",
          description: "Translations saved successfully",
        })
      } else {
        throw new Error("Failed to save translations")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while saving translations"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Filter translations based on search term - memoized for performance
  const filteredTranslations = useMemo(() => {
    return translations.filter(
      (t) =>
        t.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.es.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [translations, searchTerm])

  // Paginate translations
  const paginatedTranslations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTranslations.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredTranslations, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredTranslations.length / ITEMS_PER_PAGE)

  // Pagination controls

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Translation Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={loadTranslations}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 bg-white text-black hover:bg-zinc-200"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-900/20 text-red-400 p-3 rounded-md border border-red-900/30">{error}</div>}
      {success && (
        <div className="bg-green-900/20 text-green-400 p-3 rounded-md border border-green-900/30">{success}</div>
      )}

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Translations</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : paginatedTranslations.length === 0 ? (
            <p className="text-center py-8 text-zinc-500">
              {searchTerm ? "No translations found matching your search." : "No translations found."}
            </p>
          ) : (
            <div className="space-y-4">
              {paginatedTranslations.map((item, index) => (
                <div key={item.path} className="border border-zinc-800 p-4 rounded-md bg-zinc-800/50">
                  <Label className="font-medium text-sm text-zinc-400">{item.path}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor={`en-${index}`} className="text-xs text-zinc-500">
                        English
                      </Label>
                      <Input
                        id={`en-${index}`}
                        value={item.en}
                        onChange={(e) => updateTranslation(translations.indexOf(item), "en", e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`es-${index}`} className="text-xs text-zinc-500">
                        Spanish
                      </Label>
                      <Input
                        id={`es-${index}`}
                        value={item.es}
                        onChange={(e) => updateTranslation(translations.indexOf(item), "es", e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {filteredTranslations.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-6"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
