import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Film, Pen, Clapperboard, Loader2 } from "lucide-react";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState<"writer" | "producer" | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: selectedRole })
        .eq("id", user.id);

      if (profileError) throw profileError;

      if (selectedRole === "writer") {
        const { error: writerError } = await supabase
          .from("writer_profiles")
          .insert({ user_id: user.id });
        if (writerError) throw writerError;
      } else {
        const { error: producerError } = await supabase
          .from("producer_profiles")
          .insert({ user_id: user.id });
        if (producerError) throw producerError;
      }

      toast({
        title: "Profile complete!",
        description: `Welcome to PitchRoom as a ${selectedRole}!`,
      });

      navigate(`/${selectedRole}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Film className="h-12 w-12 text-pitch-violet" />
            <span className="text-4xl font-heading font-bold gradient-text">
              PitchRoom
            </span>
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4">Choose Your Role</h1>
          <p className="text-xl text-muted-foreground">
            How would you like to use PitchRoom?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setSelectedRole("writer")}
            className={`glass-card p-8 text-left transition-all hover:scale-105 ${
              selectedRole === "writer" ? "ring-2 ring-pitch-violet" : ""
            }`}
          >
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-2xl bg-pitch-violet/10 mb-4">
                <Pen className="h-8 w-8 text-pitch-violet" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Writer</h2>
              <p className="text-muted-foreground">
                Share your scripts, pitch to producers, and get your stories made
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-pitch-violet" />
                <span>Upload and protect your scripts</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-pitch-violet" />
                <span>Get matched with producers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-pitch-violet" />
                <span>Track your pitches</span>
              </li>
            </ul>
          </button>

          <button
            onClick={() => setSelectedRole("producer")}
            className={`glass-card p-8 text-left transition-all hover:scale-105 ${
              selectedRole === "producer" ? "ring-2 ring-pitch-gold" : ""
            }`}
          >
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-2xl bg-pitch-gold/10 mb-4">
                <Clapperboard className="h-8 w-8 text-pitch-gold" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Producer</h2>
              <p className="text-muted-foreground">
                Discover scripts, connect with writers, and find your next project
              </p>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-pitch-gold" />
                <span>Browse curated scripts</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-pitch-gold" />
                <span>Get matched with writers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-pitch-gold" />
                <span>Manage your pipeline</span>
              </li>
            </ul>
          </button>
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className="w-full md:w-auto px-12 relative overflow-hidden group"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Continue to PitchRoom"
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
