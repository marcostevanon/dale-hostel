"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import translations from "@/locales"

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

    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    } else {
      const browserLanguage = navigator.language.split("-")[0] as Language
      if (browserLanguage === "es") {
        setLanguage("es")
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("language", language)
  }, [language])

  // Simplified translation function using dot notation
  const t = (key: string): string => {
    try {
      return (key.split(".").reduce((o, i) => (o as any)?.[i], translations[language]) as string) || key
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error)
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
