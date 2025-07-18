"use client"

import { useState, useEffect } from "react"
import { ReviewCard } from "@/components/ReviewCard"
import { getReviews } from "@/lib/api"

interface Review {
  id: number
  name: string
  outlet: string
  rating: number
  comment: string
}

export function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      const data = await getReviews()
      setReviews(data)
      setIsLoading(false)
    }
    fetchReviews()
  }, [])

  return (
    <section className="container mx-auto max-w-screen-xl px-4">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
