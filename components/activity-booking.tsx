"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { fadeIn, cardHover, hoverScale } from "@/utils/animations"

export default function ActivityBooking() {
  const { t } = useLanguage()
  const activities = t("booking.activities") || []

  if (!Array.isArray(activities) || activities.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="section-container">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="section-title">{t("booking.title")}</h2>
          <p className="section-description">{t("booking.description")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              {...cardHover}
              className="relative overflow-hidden rounded-2xl h-80"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(/placeholder.svg?height=600&width=800)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                <p className="text-white/80 mb-4">{activity.description}</p>

                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{activity.duration}</span>
                </div>

                <motion.div {...hoverScale}>
                  <Link
                    href={`https://wa.me/1234567890?text=${encodeURIComponent(`I want to book the ${activity.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
                  >
                    {t("common.reserveNow")}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
