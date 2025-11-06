import { PublicNav } from "@/components/PublicNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <PublicNav />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-heading font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a question? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="glass-button"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="glass-button"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    rows={6}
                    className="glass-button resize-none"
                  />
                </div>

                <Button className="w-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                  <span className="relative">Send Message</span>
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-8">
                <div className="inline-flex p-3 rounded-2xl bg-pitch-violet/10 mb-4">
                  <Mail className="h-6 w-6 text-pitch-violet" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  Get in touch via email for support
                </p>
                <a href="mailto:hello@pitchroom.com" className="text-pitch-violet hover:text-pitch-indigo transition-colors">
                  hello@pitchroom.com
                </a>
              </div>

              <div className="glass-card p-8">
                <div className="inline-flex p-3 rounded-2xl bg-pitch-teal/10 mb-4">
                  <MessageSquare className="h-6 w-6 text-pitch-teal" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with our team during business hours
                </p>
                <p className="text-sm text-muted-foreground">
                  Mon-Fri: 9am-6pm PST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
