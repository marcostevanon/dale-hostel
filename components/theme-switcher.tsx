"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createColorTheme, updateColorScheme } from "@/utils/theme-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"
import { motion } from "framer-motion"

// Predefined color themes
const colorThemes = {
  default: {
    primary: "#e11d48", // rose-600
    secondary: "#e2e8f0", // slate-200
    accent: "#22c55e", // green-500
  },
  ocean: {
    primary: "#0ea5e9", // sky-500
    secondary: "#e0f2fe", // sky-100
    accent: "#14b8a6", // teal-500
  },
  sunset: {
    primary: "#f97316", // orange-500
    secondary: "#fef3c7", // amber-100
    accent: "#8b5cf6", // violet-500
  },
  forest: {
    primary: "#16a34a", // green-600
    secondary: "#ecfdf5", // green-50
    accent: "#ca8a04", // yellow-600
  },
}

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("default")
  const [isOpen, setIsOpen] = useState(false)

  const changeTheme = (themeName: string) => {
    const theme = colorThemes[themeName as keyof typeof colorThemes]
    if (!theme) return

    // Update the color scheme
    const newColors = createColorTheme(theme.primary, theme.secondary, theme.accent)
    updateColorScheme(newColors)

    // In a real implementation, this would update CSS variables
    // For now, we'll just log the change
    console.log(`Changed theme to ${themeName}:`, theme)

    // Update the current theme state
    setCurrentTheme(themeName)
    setIsOpen(false)

    // This is where you would update CSS variables in a real implementation
    // For example:
    document.documentElement.style.setProperty("--primary", theme.primary)

    // Show a message to the user that in a real implementation,
    // the colors would change immediately
    alert(
      `In a production implementation, the theme would change to "${themeName}" immediately. This demo just shows the structure of the color system.`,
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-4 z-50"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full"
          >
            <Palette className="h-5 w-5" />
            <span className="sr-only">Change Theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {Object.keys(colorThemes).map((themeName) => (
            <DropdownMenuItem
              key={themeName}
              className={`cursor-pointer ${currentTheme === themeName ? "font-bold" : ""}`}
              onClick={() => changeTheme(themeName)}
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: colorThemes[themeName as keyof typeof colorThemes].primary }}
                />
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
