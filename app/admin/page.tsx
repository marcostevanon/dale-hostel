"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, ImageIcon, ChevronRight } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard
          title="Image Management"
          description="Upload and manage images for your website"
          icon={<ImageIcon className="h-5 w-5" />}
          href="/admin/images"
        />

        <AdminCard
          title="Language Settings"
          description="Manage translations for your website"
          icon={<Globe className="h-5 w-5" />}
          href="/admin/translations"
        />
      </div>
    </div>
  )
}

function AdminCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 transition-colors h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="bg-white/10 p-2 rounded-md mr-3">{icon}</span>
            {title}
          </CardTitle>
          <CardDescription className="text-zinc-400">{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
            <span>Manage</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
