import { Button } from "@/components/ui/button";
import heroImage from "@/../public/globe.svg"; // Adjust the path as necessary

export function HeroSection() {
  return (
    <section className="bg-gradient-hero text-white py-16 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to NextGen Food Court
        </h1>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Discover delicious food from diverse cultures, all in one convenient location. 
          From Ethiopian delights to Nigerian classics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg" className="font-semibold">
            Browse Menu
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 text-white hover:bg-white/10 hover:text-white"
          >
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
}