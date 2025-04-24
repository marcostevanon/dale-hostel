import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Gallery from "@/components/gallery"
import Activities from "@/components/activities"
import ActivityBooking from "@/components/activity-booking"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Gallery />
      <Activities id="activities" />
      <ActivityBooking />
      <Footer id="contacts" />
    </main>
  )
}
