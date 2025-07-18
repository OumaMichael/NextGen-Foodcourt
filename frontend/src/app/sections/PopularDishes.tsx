"use client"

import { useState, useEffect } from "react"
import { DishCard } from "@/components/DishCard"
import { getDishes } from "@/lib/api"

interface Dish {
  id: number
  name: string
  outlet: string
  price: number
  image: string
}

export function PopularDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDishes = async () => {
      setIsLoading(true)
      const data = await getDishes()
      setDishes(data)
      setIsLoading(false)
    }
    fetchDishes()
  }, [])

  return (
    <section className="container mx-auto max-w-screen-xl px-4">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Popular Dishes</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
