import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { getOutlets, getDishes } from "@/lib/api"
import { DishCard } from "@/components/DishCard"
import { notFound } from "next/navigation"

interface OutletPageProps {
  params: {
    id: string
  }
}

export default async function OutletPage({ params }: OutletPageProps) {
  const outletId = Number.parseInt(params.id)
  const outlets = await getOutlets()
  const dishes = await getDishes()

  const outlet = outlets.find((o) => o.id === outletId)

  if (!outlet) {
    notFound() // Show 404 if outlet not found
  }

  const outletDishes = dishes.filter((dish) => dish.outlet.includes(outlet.name))

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow py-8">
        <section className="container mx-auto max-w-screen-xl px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{outlet.name} Menu</h1>
          <p className="text-lg text-gray-700 mb-8">Explore the delicious offerings from {outlet.name}.</p>

          {outletDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {outletDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No dishes found for this outlet yet.</p>
          )}
        </section>
      </div>
      <Footer />
    </main>
  )
}
