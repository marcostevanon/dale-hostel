/**
 * Dale Hostel Color System
 *
 * This file centralizes all color definitions for the website.
 * To change the site's color scheme, simply modify the values here.
 */

export type ColorPalette = {
  primary: {
    light: string
    DEFAULT: string
    dark: string
  }
  secondary: {
    light: string
    DEFAULT: string
    dark: string
  }
  accent: {
    light: string
    DEFAULT: string
    dark: string
  }
  background: string
  foreground: string
  muted: string
  border: string
}

// Default color palette for Dale Hostel
// To change colors, modify these values
const colors: ColorPalette = {
  primary: {
    light: "#fb7185", // rose-400
    DEFAULT: "#e11d48", // rose-600
    dark: "#be123c", // rose-700
  },
  secondary: {
    light: "#f1f5f9", // slate-100
    DEFAULT: "#e2e8f0", // slate-200
    dark: "#cbd5e1", // slate-300
  },
  accent: {
    light: "#4ade80", // green-400
    DEFAULT: "#22c55e", // green-500
    dark: "#15803d", // green-700
  },
  background: "#ffffff",
  foreground: "#0f172a", // slate-900
  muted: "#64748b", // slate-500
  border: "#e2e8f0", // slate-200
}

export default colors
