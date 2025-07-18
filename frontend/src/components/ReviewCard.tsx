import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  outlet: string
  rating: number
  comment: string
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">{review.name}</h4>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 font-medium">{review.outlet}</p>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  )
}
