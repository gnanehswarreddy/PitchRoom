import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Film, Search, Users, MessageSquare, Folder } from "lucide-react";

const ProducerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    matches: 0,
    messages: 0,
    collections: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*, producer_profiles(*)")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }
  };

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [matches, threads, collections] = await Promise.all([
      supabase.from("matches").select("id", { count: "exact" }).eq("producer_id", user.id),
      supabase.from("message_threads").select("id", { count: "exact" }).eq("producer_id", user.id),
      supabase.from("collections").select("id", { count: "exact" }).eq("producer_id", user.id),
    ]);

    setStats({
      matches: matches.count || 0,
      messages: threads.count || 0,
      collections: collections.count || 0,
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">
              Welcome back, {profile?.first_name || "Producer"}
            </h1>
            <p className="text-muted-foreground">Discover your next great project</p>
          </div>
          <div>
            <Button
              variant="outline"
              className="glass-button"
              onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Matches</span>
              <Users className="h-5 w-5 text-pitch-violet" />
            </div>
            <div className="text-3xl font-bold">{stats.matches}</div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Messages</span>
              <MessageSquare className="h-5 w-5 text-pitch-teal" />
            </div>
            <div className="text-3xl font-bold">{stats.messages}</div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Collections</span>
              <Folder className="h-5 w-5 text-pitch-gold" />
            </div>
            <div className="text-3xl font-bold">{stats.collections}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/producer/discover">
              <Button className="w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                <span className="relative flex items-center justify-center">
                  <Search className="mr-2 h-4 w-4" />
                  Discover Scripts
                </span>
              </Button>
            </Link>
            
            <Link to="/producer/matches">
              <Button variant="outline" className="w-full glass-button">
                <Users className="mr-2 h-4 w-4" />
                View Matches
              </Button>
            </Link>
            
            <Link to="/producer/messages">
              <Button variant="outline" className="w-full glass-button">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            
            <Link to="/producer/collections">
              <Button variant="outline" className="w-full glass-button">
                <Folder className="mr-2 h-4 w-4" />
                Collections
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-heading font-bold mb-6">Recommended Scripts</h2>
          <div className="text-center py-12 text-muted-foreground">
            <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Discovering scripts for you. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
