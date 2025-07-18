import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickActions } from "@/components/home/QuickActions";
import { SearchSection } from "@/components/home/SearchSection";
import { BrowseBySection } from "@/components/home/BrowseBySection";
import { PopularDishes } from "@/components/home/PopularDishes";
import { NoticesSection } from "@/components/home/NoticesSection";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const Index = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pb-20">
            <HeroSection />
            <QuickActions />
            <SearchSection />
            <BrowseBySection />
            <PopularDishes />
            <NoticesSection />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default Index;
