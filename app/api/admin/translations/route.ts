import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Helper function to read translations
async function readTranslations(language: string) {
  try {
    const filePath = path.join(process.cwd(), `locales/${language}.js`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Translation file for ${language} not found at ${filePath}`)
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8")

    // Extract the JSON object from the JavaScript file
    try {
      const jsonStr = fileContent
        .replace(/^const\s+translations\s*=\s*/, "")
        .replace(/export\s+default\s+translations.*$/, "")
        .trim()

      return JSON.parse(jsonStr)
    } catch (parseError) {
      throw new Error(
        `Error parsing translations for ${language}: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      )
    }
  } catch (error) {
    console.error(`Error reading translations for ${language}:`, error)
    throw error
  }
}

// Helper function to write translations
async function writeTranslations(language: string, translations: any) {
  try {
    const filePath = path.join(process.cwd(), `locales/${language}.js`)

    // Format the translations as a JavaScript file
    const fileContent = `const translations = ${JSON.stringify(translations, null, 2)}

export default translations
`

    // Write the file
    fs.writeFileSync(filePath, fileContent, "utf8")
    return true
  } catch (error) {
    console.error(`Error writing translations for ${language}:`, error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "en"

    const translations = await readTranslations(language)

    return NextResponse.json({ translations })
  } catch (error) {
    console.error("Error getting translations:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get translations",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { language, translations } = await request.json()

    if (!language || !translations) {
      return NextResponse.json({ error: "Language and translations are required" }, { status: 400 })
    }

    await writeTranslations(language, translations)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving translations:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save translations",
      },
      { status: 500 },
    )
  }
}
