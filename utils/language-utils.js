export function createNewLanguage(languageCode, languageName) {
  return `
To add ${languageName} (${languageCode}) support:

1. Create a new file at 'locales/${languageCode}.js'
2. Copy the structure from 'locales/en.js'
3. Translate all values (keep the keys the same)
4. Import the new translations in 'contexts/language-context.tsx':
   import ${languageCode}Translations from "@/locales/${languageCode}"
5. Add the translations to the translationsMap:
   const translationsMap = {
     en: enTranslations,
     es: esTranslations,
     ${languageCode}: ${languageCode}Translations,
   }
6. Add the language to the language switcher in 'components/language-switcher.tsx':
   const languages = [
     { code: "en", name: t("english", "languageSwitcher") },
     { code: "es", name: t("spanish", "languageSwitcher") },
     { code: "${languageCode}", name: "${languageName}" }, // Add this line
   ]
7. Add the language name to both language files:
   - In 'locales/en.js' add: ${languageCode}: "${languageName}"
   - In 'locales/es.js' add: ${languageCode}: "[${languageName} in Spanish]"
   - In 'locales/${languageCode}.js' add translations for all other languages

That's it! The language system will automatically detect and load the new language.
`
}

/**
 * Type definition for language files to ensure consistency
 */
export const languageSchema = {
  common: {
    bookNow: "",
    exploreActivities: "",
    followUs: "",
    contactUs: "",
    allRightsReserved: "",
    reserveNow: "",
  },
  hero: {
    title: "",
    description: "",
  },
  gallery: {
    title: "",
    description: "",
    spaces: {
      commonArea: "",
      pool: "",
      dormitory: "",
      terrace: "",
      kitchen: "",
      privateRoom: "",
    },
  },
  activities: {
    title: "",
    description: "",
    items: {
      wineTasting: "",
      hiking: "",
      cityTour: "",
      cookingClass: "",
      bikeTour: "",
      hostelParty: "",
    },
  },
  booking: {
    title: "",
    description: "",
    activities: [
      {
        title: "",
        description: "",
        duration: "",
      },
    ],
  },
  footer: {
    description: "",
    address: "",
  },
  languageSwitcher: {
    language: "",
    english: "",
    spanish: "",
  },
}
