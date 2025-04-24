import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/contexts/language-context"
import { ErrorBoundary } from "@/components/error-boundary"
import ImageMappingInitializer from "@/components/image-mapping-initializer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dale Hostel - Experience Mendoza Like Never Before",
  description:
    "Dale Hostel offers a unique blend of comfort, community, and authentic experiences in the heart of Mendoza, Argentina.",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <LanguageProvider>
            {/* This component ensures the image mapping exists */}
            <ImageMappingInitializer />
            {children}
            <Toaster />
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
