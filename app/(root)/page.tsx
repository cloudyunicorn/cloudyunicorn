import { Rocket, Sparkles, BarChart, Cloud, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-7xl px-4 py-20 mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border shadow-sm">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Next-gen Social Media Management</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Transform Your Social Presence with
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {' '}Cloudy Unicorn
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AI-powered scheduling, analytics, and content optimization for modern brands. 
              Manage all your social platforms in one intuitive dashboard.
            </p>

            <div className="flex gap-4 justify-center">
              <Button className="h-12 px-8 rounded-xl text-lg" asChild>
                <Link href="/sign-up">
                  Get Started Free
                </Link>
              </Button>
              <Button variant="outline" className="h-12 px-8 rounded-xl text-lg" asChild>
                <Link href="/demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Cloudy Unicorn?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Rocket className="h-8 w-8" />,
                  title: "AI-Powered Scheduling",
                  description: "Smart calendar with optimal posting times based on audience engagement"
                },
                {
                  icon: <BarChart className="h-8 w-8" />,
                  title: "Advanced Analytics",
                  description: "Real-time performance tracking across all platforms"
                },
                {
                  icon: <Cloud className="h-8 w-8" />,
                  title: "Cross-Platform Management",
                  description: "Manage all your social accounts in one place"
                }
              ].map((feature, index) => (
                <div key={index} className="p-8 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="mb-4 text-primary">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4 text-primary">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Trusted by 5000+ Creators</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Social Media Game?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of marketers and creators already growing with Cloudy Unicorn
            </p>
            <Button className="h-14 px-12 rounded-xl text-lg gap-2" asChild>
              <Link href="/signup">
                <Sparkles className="h-5 w-5" />
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}