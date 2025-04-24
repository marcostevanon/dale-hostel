"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import translations from "@/locales"
import { logError } from "@/utils/error-logger"

type Language = "en" | "es"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        setLanguage(savedLanguage)
      } else {
        // If no saved language, try to detect from browser
        const browserLanguage = navigator.language.split("-")[0] as Language
        if (browserLanguage === "es") {
          setLanguage("es")
        }
        // Save the detected language to localStorage
        localStorage.setItem("language", browserLanguage === "es" ? "es" : "en")
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("language", language)
      // Also set the HTML lang attribute for better accessibility and SEO
      document.documentElement.lang = language
    } catch (error) {
      console.error("Error saving language to localStorage:", error)
    }
  }, [language])

  // Update the translation function to include error tracking
  const t = (key: string): string => {
    try {
      return (key.split(".").reduce((o, i) => (o as any)?.[i], translations[language]) as string) || key
    } catch (error) {
      if (error instanceof Error) {
        logError(error, { key, language })
      } else {
        console.error(`Translation error for key: ${key}`, error)
      }
      return key
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
