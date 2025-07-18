import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const cuisines = ["Ethiopian", "Congolese", "Kenyan", "Nigerian"];
const outlets = ["Mama Africa", "Spice Garden", "Safari Kitchen", "Heritage"];

export function BrowseBySection() {
  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Browse by Cuisine</h2>
          <Button variant="link" className="text-primary p-0 h-auto font-medium">
            See more <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {cuisines.map((cuisine) => (
            <Button 
              key={cuisine} 
              variant="cuisine" 
              size="cuisine"
              className="justify-center font-medium"
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Browse by Outlet</h2>
          <Button variant="link" className="text-primary p-0 h-auto font-medium">
            See more <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {outlets.map((outlet) => (
            <Button 
              key={outlet} 
              variant="cuisine" 
              size="cuisine"
              className="justify-center font-medium"
            >
              {outlet}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}