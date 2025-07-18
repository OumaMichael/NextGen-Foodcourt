"use client" // Mark as client component to use useRouter
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation" // Import useRouter

interface Outlet {
  id: number
  name: string
}

interface OutletCardProps {
  outlet: Outlet
}

export function OutletCard({ outlet }: OutletCardProps) {
  const router = useRouter()

  const handleViewMenu = () => {
    router.push(`/outlets/${outlet.id}`) // Navigate to dynamic outlet page
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{outlet.name.charAt(0)}</span>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
            {outlet.name}
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-orange-50 group-hover:border-orange-200 bg-transparent"
            onClick={handleViewMenu} // Add onClick handler
          >
            View Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
