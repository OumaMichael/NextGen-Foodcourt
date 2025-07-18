import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Dish {
  id: number
  name: string
  outlet: string
  price: number
  image: string
}

interface DishCardProps {
  dish: Dish
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={dish.image || "/placeholder.svg"}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {dish.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {dish.outlet}
          </Badge>
          <p className="text-lg font-bold text-orange-600">${dish.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
