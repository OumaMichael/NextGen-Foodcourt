import { getPopularDishes } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function PopularDishes() {
  const dishes = getPopularDishes();

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Popular Dishes</h2>
      <div className="space-y-4">
        {dishes.map((dish) => (
          <Card key={dish.id} className="shadow-soft hover:shadow-warm transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{dish.name}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{dish.outletName}</p>
                  {dish.description && (
                    <p className="text-muted-foreground text-sm mb-2">{dish.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <p className="text-primary font-bold text-lg">${dish.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-soft text-yellow-soft" />
                      <span className="text-sm font-medium">{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}