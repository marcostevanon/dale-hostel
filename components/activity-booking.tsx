"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import TaggedImage from "./tagged-image"

export default function ActivityBooking() {
  const { t } = useLanguage()
  const activities = t("booking.activities") || []

  if (!Array.isArray(activities) || activities.length === 0) {
    return null
  }

  // Map of activity titles to image tags
  const activityImageTags: Record<string, string> = {
    "Wine Tasting Tour": "booking-wine-tasting",
    "Tour de Degustación de Vinos": "booking-wine-tasting",
    "Andes Mountain Trek": "booking-andes-trek",
    "Trekking en los Andes": "booking-andes-trek",
    "City Bike Tour": "booking-bike-tour",
    "Tour en Bicicleta por la Ciudad": "booking-bike-tour",
    "Cooking Class": "booking-cooking-class",
    "Clase de Cocina": "booking-cooking-class",
    "Hostel Party Night": "booking-party",
    "Noche de Fiesta en el Hostel": "booking-party",
    "Olive Oil Tasting": "booking-olive-oil",
    "Degustación de Aceite de Oliva": "booking-olive-oil",
  }

  return (
    <section className="py-20 bg-secondary">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">{t("booking.title")}</h2>
          <p className="section-description">{t("booking.description")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-xl h-80"
            >
              <div className="absolute inset-0 bg-cover bg-center">
                <TaggedImage
                  tag={activityImageTags[activity.title] || `booking-activity-${index}`}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                  <p className="text-white/80">{activity.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{activity.duration}</span>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={`https://wa.me/1234567890?text=${encodeURIComponent(`I want to book the ${activity.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
                    >
                      {t("common.bookNow")}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
