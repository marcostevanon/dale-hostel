import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Helper function to get available languages
function getAvailableLanguages() {
  try {
    const localesDir = path.join(process.cwd(), "locales")
    const files = fs.readdirSync(localesDir)

    // Filter JavaScript files and remove the extension
    return files.filter((file) => file.endsWith(".js") && file !== "index.js").map((file) => file.replace(".js", ""))
  } catch (error) {
    console.error("Error getting available languages:", error)
    throw error
  }
}

// Helper function to create a new language file
function createLanguageFile(code: string, name: string) {
  try {
    // Read the English file as a template
    const enFilePath = path.join(process.cwd(), "locales/en.js")
    const enFileContent = fs.readFileSync(enFilePath, "utf8")

    // Create the new language file
    const newFilePath = path.join(process.cwd(), `locales/${code}.js`)
    fs.writeFileSync(newFilePath, enFileContent, "utf8")

    // Update the index.js file to include the new language
    updateIndexFile(code)

    return true
  } catch (error) {
    console.error(`Error creating language file for ${code}:`, error)
    throw error
  }
}

// Helper function to update the index.js file
function updateIndexFile(newLanguageCode: string) {
  try {
    const indexFilePath = path.join(process.cwd(), "locales/index.js")

    // Read the current index file
    let indexContent = fs.readFileSync(indexFilePath, "utf8")

    // Check if the language is already imported
    if (indexContent.includes(`import ${newLanguageCode} from "./${newLanguageCode}"`)) {
      return // Already included
    }

    // Add the import statement
    const importStatement = `import ${newLanguageCode} from "./${newLanguageCode}"\n`
    indexContent = indexContent.replace(/import.*\n/, (match) => match + importStatement)

    // Add the language to the translations object
    indexContent = indexContent.replace(/const translations = {[^}]*}/s, (match) =>
      match.replace(/}$/, `,\n  ${newLanguageCode},\n}`),
    )

    // Write the updated file
    fs.writeFileSync(indexFilePath, indexContent, "utf8")
  } catch (error) {
    console.error(`Error updating index.js for ${newLanguageCode}:`, error)
    throw error
  }
}

export async function GET() {
  try {
    const languages = getAvailableLanguages()
    return NextResponse.json({ languages })
  } catch (error) {
    console.error("Error getting languages:", error)
    return NextResponse.json({ error: "Failed to get languages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { code, name } = await request.json()

    if (!code || !name) {
      return NextResponse.json({ error: "Language code and name are required" }, { status: 400 })
    }

    // Validate language code format
    if (!/^[a-z]{2,3}$/.test(code)) {
      return NextResponse.json({ error: "Invalid language code format" }, { status: 400 })
    }

    // Check if the language already exists
    const languages = getAvailableLanguages()
    if (languages.includes(code)) {
      return NextResponse.json({ error: "Language already exists" }, { status: 400 })
    }

    // Create the language file
    createLanguageFile(code, name)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding language:", error)
    return NextResponse.json({ error: "Failed to add language" }, { status: 500 })
  }
}
