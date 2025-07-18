import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";

export function QuickActions() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <Button variant="food" size="lg" className="h-14 flex-col gap-2">
          <UtensilsCrossed className="h-6 w-6" />
          <span>Browse Food</span>
        </Button>
        <Button variant="outline" size="lg" className="h-14 flex-col gap-2 border-primary hover:bg-primary hover:text-white">
          <ShoppingBag className="h-6 w-6" />
          <span>Order Now</span>
        </Button>
      </div>
    </section>
  );
}