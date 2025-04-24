import { ensureImageMapping } from "./ensure-image-mapping"
import { ensureTranslations } from "./ensure-translations"

/**
 * This script ensures that all default configurations exist
 * It runs both the image mapping and translations checks
 */
async function ensureDefaults() {
  try {
    console.log("Starting default configuration checks...")

    // Ensure image mapping exists
    await ensureImageMapping()

    // Ensure translations exist
    await ensureTranslations()

    console.log("All default configuration checks completed successfully.")
  } catch (error) {
    console.error("Error ensuring default configurations:", error)
  }
}

// Run the script
ensureDefaults()
  .then(() => console.log("Default configuration setup completed."))
  .catch((error) => console.error("Error running script:", error))
