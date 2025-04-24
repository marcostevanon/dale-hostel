"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import TaggedImage from "./tagged-image"
import { SITE_IMAGES } from "@/constants/image-tags"

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center z-0">
        <TaggedImage
          tag={SITE_IMAGES.HERO_BACKGROUND}
          fill
          sizes="100vw"
          className="object-cover"
          alt="Dale Hostel exterior view"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" style={{ filter: "brightness(0.7)" }}></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">{t("hero.title")}</h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">{t("hero.description")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 text-lg">
                {t("common.bookNow")}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full px-8 text-lg"
                asChild
              >
                <Link href="#activities">{t("common.exploreActivities")}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  )
}
