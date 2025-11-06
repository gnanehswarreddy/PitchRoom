import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Film, Shield, Users, Zap, TrendingUp, MessageSquare, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pitch-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pitch-teal"></span>
              </span>
              <span className="text-sm text-pitch-teal font-medium">Now in Beta</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              Where <span className="gradient-text">Writers</span> Meet{" "}
              <span className="gold-gradient-text">Producers</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Secure script sharing, intelligent matching, and seamless collaboration.
              Get your story from page to screen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="relative overflow-hidden group px-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                  <span className="relative flex items-center">
                    Start Free <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="glass-button px-8">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
          
          <div className="mt-20 glass-card p-8 rounded-3xl max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-pitch-violet/20 to-pitch-indigo/20 rounded-2xl flex items-center justify-center">
              <Film className="h-24 w-24 text-pitch-violet/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools for modern storytelling
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <div className="inline-flex p-3 rounded-2xl bg-pitch-violet/10 mb-4">
                <Shield className="h-6 w-6 text-pitch-violet" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">DRM Protection</h3>
              <p className="text-muted-foreground">
                Industry-grade script security with watermarks and access control
              </p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <div className="inline-flex p-3 rounded-2xl bg-pitch-teal/10 mb-4">
                <Zap className="h-6 w-6 text-pitch-teal" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                AI-powered recommendations based on genre, style, and preferences
              </p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <div className="inline-flex p-3 rounded-2xl bg-pitch-gold/10 mb-4">
                <MessageSquare className="h-6 w-6 text-pitch-gold" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Real-time Chat</h3>
              <p className="text-muted-foreground">
                Instant messaging and file sharing with producers and writers
              </p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <div className="inline-flex p-3 rounded-2xl bg-pitch-violet/10 mb-4">
                <Users className="h-6 w-6 text-pitch-violet" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Video Pitches</h3>
              <p className="text-muted-foreground">
                Upload video pitches to bring your story to life
              </p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <div className="inline-flex p-3 rounded-2xl bg-pitch-teal/10 mb-4">
                <TrendingUp className="h-6 w-6 text-pitch-teal" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track views, engagement, and pitch performance
              </p>
            </div>
            
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <div className="inline-flex p-3 rounded-2xl bg-pitch-gold/10 mb-4">
                <Film className="h-6 w-6 text-pitch-gold" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Collections</h3>
              <p className="text-muted-foreground">
                Organize scripts into projects and production pipelines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              From script to screen in three simple steps
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pitch-violet to-pitch-indigo flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="glass-card p-6 flex-1">
                <h3 className="text-2xl font-heading font-bold mb-2">Upload Your Script</h3>
                <p className="text-muted-foreground">
                  Securely upload your screenplay with automatic DRM protection and watermarking
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pitch-violet to-pitch-indigo flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="glass-card p-6 flex-1">
                <h3 className="text-2xl font-heading font-bold mb-2">Get Matched</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your script and connects you with relevant producers or writers
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pitch-violet to-pitch-indigo flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="glass-card p-6 flex-1">
                <h3 className="text-2xl font-heading font-bold mb-2">Start Collaborating</h3>
                <p className="text-muted-foreground">
                  Chat, schedule calls, and manage your project from pitch to production
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-12 rounded-3xl text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of writers and producers already using PitchRoom
            </p>
            <Link to="/signup">
              <Button size="lg" className="relative overflow-hidden group px-12">
                <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                <span className="relative">Create Free Account</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Film className="h-6 w-6 text-pitch-violet" />
              <span className="text-xl font-heading font-bold gradient-text">
                PitchRoom
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2024 PitchRoom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
