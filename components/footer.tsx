"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Phone, Mail, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer({ id } : { id: string }) {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-16" id={id}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Dale Hostel</h2>
            <p className="text-gray-300 max-w-md mb-8">{t("footer.description")}</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-primary-light" />
                <span className="text-gray-300">{t("footer.address")}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary-light" />
                <Link href="tel:+5492615555555" className="text-gray-300 hover:text-white transition-colors">
                  +54 9 261 555-5555
                </Link>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary-light" />
                <Link href="mailto:info@dalehostel.com" className="text-gray-300 hover:text-white transition-colors">
                  info@dalehostel.com
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:items-end"
          >
            <h3 className="text-2xl font-bold mb-6">{t("common.followUs")}</h3>
            <div className="flex space-x-4 mb-8">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-dark h-12 w-12 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent hover:bg-accent-dark h-12 w-12 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.267-.465-2.414-1.485-.893-.795-1.494-1.78-1.67-2.079-.173-.3-.018-.462.13-.61.134-.133.3-.347.45-.52.149-.174.199-.3.299-.498.1-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.217-.242-.579-.487-.5-.672-.51-.172-.008-.371-.01-.571-.01-.2 0-.522.074-.796.375-.273.3-1.045 1.02-1.045 2.488s1.07 2.887 1.22 3.086c.149.2 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            <div className="mt-auto">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Dale Hostel. {t("common.allRightsReserved")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
