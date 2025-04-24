import colors, { type ColorPalette } from "@/config/colors"

/**
 * Updates the website's color scheme
 * @param newColors Partial color palette to update
 * @returns The updated color palette
 */
export function updateColorScheme(newColors: Partial<ColorPalette>): ColorPalette {
  // This is a simple implementation that would need to be expanded
  // to actually update CSS variables or use a more sophisticated approach

  // In a real implementation, this would update CSS variables or a theme context
  console.log("Updating color scheme:", newColors)

  // For now, just return the merged colors
  return { ...colors, ...newColors }
}

/**
 * Converts a hex color to HSL format for CSS variables
 * @param hex Hex color code (e.g., #ff0000)
 * @returns HSL values as "H S% L%" string
 */
export function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16) / 255
  const g = Number.parseInt(hex.substring(2, 4), 16) / 255
  const b = Number.parseInt(hex.substring(4, 6), 16) / 255

  // Find the min and max values to calculate the lightness
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h = Math.round(h * 60)
  }

  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}

/**
 * Creates a color theme object from primary, secondary, and accent colors
 * @param primary Primary color hex
 * @param secondary Secondary color hex
 * @param accent Accent color hex
 * @returns A color theme object
 */
export function createColorTheme(primary: string, secondary: string, accent: string): Partial<ColorPalette> {
  // This is a simplified implementation
  // In a real app, you might generate shades and tints automatically

  return {
    primary: {
      DEFAULT: primary,
      // These would ideally be calculated based on the primary color
      light: adjustBrightness(primary, 20),
      dark: adjustBrightness(primary, -20),
    },
    secondary: {
      DEFAULT: secondary,
      light: adjustBrightness(secondary, 20),
      dark: adjustBrightness(secondary, -20),
    },
    accent: {
      DEFAULT: accent,
      light: adjustBrightness(accent, 20),
      dark: adjustBrightness(accent, -20),
    },
  }
}

/**
 * Adjusts the brightness of a hex color
 * @param hex Hex color code
 * @param percent Percentage to adjust (-100 to 100)
 * @returns Adjusted hex color
 */
function adjustBrightness(hex: string, percent: number): string {
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  let r = Number.parseInt(hex.substring(0, 2), 16)
  let g = Number.parseInt(hex.substring(2, 4), 16)
  let b = Number.parseInt(hex.substring(4, 6), 16)

  // Adjust brightness
  r = clamp(r + Math.round(r * (percent / 100)))
  g = clamp(g + Math.round(g * (percent / 100)))
  b = clamp(b + Math.round(b * (percent / 100)))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

/**
 * Clamps a value between 0 and 255
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(255, value))
}
