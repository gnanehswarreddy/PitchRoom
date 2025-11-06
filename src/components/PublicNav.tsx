import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const PublicNav = () => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) setIsAuthed(!!user);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-pitch-darker/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Film className="h-8 w-8 text-pitch-violet" />
              <div className="absolute inset-0 blur-lg bg-pitch-violet/30 -z-10" />
            </div>
            <span className="text-2xl font-heading font-bold gradient-text">
              PitchRoom
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthed ? (
              <>
                <Link to="/writer/dashboard">
                  <Button variant="ghost" className="glass-button">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                  <span className="relative">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="glass-button">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                    <span className="relative">Get Started</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
