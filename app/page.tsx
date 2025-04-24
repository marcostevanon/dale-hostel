import Hero from "@/components/hero"
import Gallery from "@/components/gallery"
import Activities from "@/components/activities"
import ActivityBooking from "@/components/activity-booking"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Gallery />
      <Activities />
      <ActivityBooking />
      <Footer />
    </main>
  )
}
