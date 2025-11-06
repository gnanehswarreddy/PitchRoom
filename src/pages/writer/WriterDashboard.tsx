import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Film, Plus, FileText, Users, MessageSquare, TrendingUp } from "lucide-react";

const WriterDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    scripts: 0,
    matches: 0,
    messages: 0,
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
        .select("*, writer_profiles(*)")
        .eq("id", user.id)
        .single();
      setProfile(data);
    }
  };

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [scripts, matches, threads] = await Promise.all([
      supabase.from("scripts").select("id", { count: "exact" }).eq("writer_id", user.id),
      supabase.from("matches").select("id", { count: "exact" }).eq("writer_id", user.id),
      supabase.from("message_threads").select("id", { count: "exact" }).eq("writer_id", user.id),
    ]);

    setStats({
      scripts: scripts.count || 0,
      matches: matches.count || 0,
      messages: threads.count || 0,
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">
              Welcome back, {profile?.first_name || "Writer"}
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your scripts</p>
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
              <span className="text-muted-foreground">Scripts</span>
              <FileText className="h-5 w-5 text-pitch-violet" />
            </div>
            <div className="text-3xl font-bold">{stats.scripts}</div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Matches</span>
              <Users className="h-5 w-5 text-pitch-teal" />
            </div>
            <div className="text-3xl font-bold">{stats.matches}</div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Messages</span>
              <MessageSquare className="h-5 w-5 text-pitch-gold" />
            </div>
            <div className="text-3xl font-bold">{stats.messages}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/writer/scripts/new">
              <Button className="w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-pitch-violet to-pitch-indigo transition-transform group-hover:scale-105" />
                <span className="relative flex items-center justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Script
                </span>
              </Button>
            </Link>
            
            <Link to="/writer/matches">
              <Button variant="outline" className="w-full glass-button">
                <Users className="mr-2 h-4 w-4" />
                View Matches
              </Button>
            </Link>
            
            <Link to="/writer/messages">
              <Button variant="outline" className="w-full glass-button">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            
            <Link to="/writer/analytics">
              <Button variant="outline" className="w-full glass-button">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-heading font-bold mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-muted-foreground">
            <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No recent activity yet. Upload your first script to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
