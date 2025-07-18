import { BrowseCuisine } from "@/app/sections/BrowseCuisine"
import { BrowseOutlets } from "@/app/sections/BrowseOutlets"
import { PopularDishes } from "@/app/sections/PopularDishes"
import { CustomerReviews } from "@/app/sections/CustomerReviews"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow space-y-16 py-8">
        <BrowseCuisine />
        <BrowseOutlets />
        <PopularDishes />
        <CustomerReviews />
      </div>
      <Footer />
    </main>
  )
}
