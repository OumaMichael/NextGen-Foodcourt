import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Cuisine {
  id: number
  name: string
  image: string
}

interface CuisineCardProps {
  cuisine: Cuisine
}

export function CuisineCard({ cuisine }: CuisineCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={cuisine.image || "/placeholder.svg"} // Use the actual image path
            alt={cuisine.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg drop-shadow-lg">{cuisine.name}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
