"use client"

import { useState, useEffect } from "react"
import { OutletCard } from "@/components/OutletCard"
import { Button } from "@/components/ui/button"
import { getOutlets } from "@/lib/api"
import Link from "next/link"

interface Outlet {
  id: number
  name: string
}

export function BrowseOutlets() {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOutlets = async () => {
      setIsLoading(true)
      const data = await getOutlets()
      setOutlets(data)
      setIsLoading(false)
    }
    fetchOutlets()
  }, [])

  return (
    <section className="container mx-auto max-w-screen-xl px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Outlet</h2>
          <Link href="/outlets" passHref>
            {" "}
            <Button className="bg-orange-600 hover:bg-orange-700">See more</Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {outlets.map((outlet) => (
              <OutletCard key={outlet.id} outlet={outlet} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
