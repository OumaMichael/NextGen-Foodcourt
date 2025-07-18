import { getCustomerReviews } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function NoticesSection() {
  const reviews = getCustomerReviews();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-soft text-yellow-soft" : "text-muted-foreground/30"
        }`}
      />
    ));
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-gradient-card shadow-soft border-yellow-soft/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.outlet}</p>
                </div>
                <div className="flex gap-1">{renderStars(review.rating)}</div>
              </div>
              <p className="text-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}