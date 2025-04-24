import fs from "fs"
import path from "path"
import defaultTranslations from "../config/default-translations"

/**
 * This script ensures that the translation files exist in the locales directory
 * It should be run during the build process
 */
export async function ensureTranslations() {
  try {
    console.log("Checking if translation files exist...")

    // Get the locales directory path
    const localesDir = path.join(process.cwd(), "locales")

    // Create the locales directory if it doesn't exist
    if (!fs.existsSync(localesDir)) {
      console.log("Locales directory not found. Creating directory...")
      fs.mkdirSync(localesDir, { recursive: true })
    }

    // Check and create each translation file
    for (const [lang, translations] of Object.entries(defaultTranslations)) {
      const filePath = path.join(localesDir, `${lang}.js`)

      if (!fs.existsSync(filePath)) {
        console.log(`Translation file for ${lang} not found. Creating default file...`)

        // Format the translations as a JavaScript file
        const fileContent = `const translations = ${JSON.stringify(translations, null, 2)}

export default translations
`

        // Write the file
        fs.writeFileSync(filePath, fileContent, "utf8")
        console.log(`Default ${lang} translations created successfully.`)
      } else {
        console.log(`Translation file for ${lang} already exists.`)
      }
    }

    // Ensure index.js exists
    const indexPath = path.join(localesDir, "index.js")
    if (!fs.existsSync(indexPath)) {
      console.log("Locales index file not found. Creating default file...")

      // Create a simple index file that imports all available translations
      const languages = Object.keys(defaultTranslations)
      const imports = languages.map((lang) => `import ${lang} from "./${lang}"`).join("\n")
      const exportObj = `{\n  ${languages.join(",\n  ")},\n}`

      const indexContent = `${imports}

const translations = ${exportObj}

export default translations
`

      fs.writeFileSync(indexPath, indexContent, "utf8")
      console.log("Default locales index file created successfully.")
    } else {
      console.log("Locales index file already exists.")
    }
  } catch (error) {
    console.error("Error ensuring translations:", error)
  }
}

// Run the script if it's called directly
if (require.main === module) {
  ensureTranslations()
    .then(() => console.log("Translations check completed."))
    .catch((error) => console.error("Error running script:", error))
}
