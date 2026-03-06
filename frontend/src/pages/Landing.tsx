import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gavel, ShieldCheck, Zap, TrendingUp } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Bid. Win. <span className="text-primary italic">Celebrate.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            The most premium auction platform for elite collectors. Experience real-time bidding with unparalleled security and speed.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="h-12 px-8 text-lg" asChild>
              <Link to="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
              <Link to="/#features">Explore Features</Link>
            </Button>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 -z-10 h-full w-full opacity-20 dark:opacity-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Auction Pro?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We provide the tools you need to run successful auctions or find the rarest items in the world.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-primary" />} 
              title="Real-time Bidding" 
              description="Low-latency updates ensure you never miss a bid in the heat of the action."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-primary" />} 
              title="Secure Payments" 
              description="Your transactions are protected by industry-leading security protocols."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10 text-primary" />} 
              title="Market Insights" 
              description="Get detailed analytics and price trends for all auction items."
            />
            <FeatureCard 
              icon={<Gavel className="h-10 w-10 text-primary" />} 
              title="Verified Sellers" 
              description="Every seller is thoroughly vetted to ensure authentic luxury goods."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to start your first auction?</h2>
          <p className="mb-10 text-lg opacity-90">Join thousands of collectors and starts winning today.</p>
          <Button size="lg" variant="secondary" className="h-12 px-10 text-lg" asChild>
            <Link to="/signup">Join Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Auction Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md">
      <div className="mb-6">{icon}</div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default Landing;