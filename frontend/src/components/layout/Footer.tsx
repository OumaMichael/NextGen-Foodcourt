export function Footer() {
  return (
    <footer className="bg-foreground/5 border-t border-border py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">NextGen Food Court</h3>
            <p className="text-muted-foreground text-sm">
              Discover delicious food from diverse cultures in one convenient location.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Browse Menu</a></li>
              <li><a href="#" className="hover:text-primary">Order Online</a></li>
              <li><a href="#" className="hover:text-primary">Locations</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">Hours</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Monday - Friday: 10AM - 9PM</p>
              <p>Saturday - Sunday: 11AM - 10PM</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
          © 2025 NextGen Food Court. All rights reserved.
        </div>
      </div>
    </footer>
  );
}