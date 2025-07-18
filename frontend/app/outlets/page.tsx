import { BrowseOutlets } from "@/app/sections/BrowseOutlets"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function OutletsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow py-8">
        <section className="container mx-auto max-w-screen-xl px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">All Outlets</h1>
          {/* Re-using BrowseOutlets component, but without the "See more" button */}
          <BrowseOutlets />
          <p className="text-center text-gray-600 mt-8">This page would list all available food outlets.</p>
        </section>
      </div>
      <Footer />
    </main>
  )
}
