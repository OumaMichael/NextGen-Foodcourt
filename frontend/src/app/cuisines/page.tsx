import { BrowseCuisine } from "@/app/sections/BrowseCuisine"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function CuisinesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow py-8">
        <section className="container mx-auto max-w-screen-xl px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">All Cuisines</h1>
          {/* Re-using BrowseCuisine component, but without the "See more" button */}
          <BrowseCuisine />
          <p className="text-center text-gray-600 mt-8">This page would list all available cuisines.</p>
        </section>
      </div>
      <Footer />
    </main>
  )
}
