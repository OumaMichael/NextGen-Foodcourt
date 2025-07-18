"use client"

import { useState, useEffect } from "react"
import { CuisineCard } from "@/components/CuisineCard"
import { Button } from "@/components/ui/button"
import { getCuisines } from "@/lib/api"
import Link from "next/link"

interface Cuisine {
  id: number
  name: string
  image: string
}

export function BrowseCuisine() {
  const [cuisines, setCuisines] = useState<Cuisine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCuisines = async () => {
      setIsLoading(true)
      const data = await getCuisines()
      setCuisines(data)
      setIsLoading(false)
    }
    fetchCuisines()
  }, [])

  return (
    <section className="container mx-auto max-w-screen-xl px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Cuisine</h2>
          <Link href="/cuisines" passHref>
            {" "}
            <Button variant="link" className="text-orange-600 hover:text-orange-700 transition-colors duration-200">
              See more →
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {cuisines.map((cuisine) => (
              <CuisineCard key={cuisine.id} cuisine={cuisine} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
