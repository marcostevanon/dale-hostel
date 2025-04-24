"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import TaggedImage from "./tagged-image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SITE_IMAGES } from "@/constants/image-tags"

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Navigation links with translations
  const navLinks = [
    { href: "#activities", label: t("navigation.activities") },
    { href: "#contacts", label: t("navigation.contact") },
  ]

  // Language options
  const languages = [
    { code: "es", name: t("languageSwitcher.spanish") },
    { code: "en", name: t("languageSwitcher.english") },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-40 flex items-center">
          <TaggedImage
            tag={SITE_IMAGES.LOGO}
            alt="Dale Hostel Logo"
            className="object-contain"
            fill
            sizes="160px"
            fallbackSrc="/dale-logo.png"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <nav className="flex items-center mr-6 space-x-6">
            {/* Language Switcher (Desktop) */}
            <DropdownMenu open={isLangMenuOpen} onOpenChange={setIsLangMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    scrolled ? "text-gray-800" : "text-white"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>{language.toUpperCase()}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className={`cursor-pointer ${language === lang.code ? "font-bold" : ""}`}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsLangMenuOpen(false)
                    }}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  scrolled ? "text-gray-800" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Reserve Button (Desktop) */}
          <Button size="sm" className="bg-primary hover:bg-primary-dark text-white rounded-full px-6">
            {t("common.bookNow")}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full bg-white/10 backdrop-blur-sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} />
          )}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 md:hidden"
            >
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-800 font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Language Switcher (Mobile) */}
                <div className="py-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">{t("languageSwitcher.language")}</p>
                  <div className="flex gap-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`text-gray-800 hover:text-primary ${
                          language === lang.code ? "font-bold text-primary" : ""
                        }`}
                        onClick={() => {
                          setLanguage(lang.code)
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Button size="sm" className="bg-primary hover:bg-primary-dark text-white rounded-full px-6 w-full mt-2">
                  {t("common.bookNow")}
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
