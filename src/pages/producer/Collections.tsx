import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Collections = () => {
  const collectionsQuery = useQuery({
    queryKey: ["producer-collections"],
    queryFn: async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr; if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("collections")
        .select("id, name, description, created_at")
        .eq("producer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link to="/producer/dashboard">
            <Button variant="ghost" className="glass-button">← Back to Dashboard</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-heading font-bold mb-2">Collections</h1>
        <p className="text-muted-foreground mb-6">Manage your saved script collections here.</p>

        {collectionsQuery.isLoading && <p className="text-muted-foreground">Loading collections...</p>}
        {collectionsQuery.error && <p className="text-destructive">Failed to load collections.</p>}
        {!collectionsQuery.isLoading && !collectionsQuery.error && (
          <div className="grid gap-4">
            {collectionsQuery.data.length === 0 && (
              <p className="text-muted-foreground">No collections yet.</p>
            )}
            {collectionsQuery.data.map((c) => (
              <div key={c.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{c.name}</div>
                    {c.description && <div className="text-sm text-muted-foreground">{c.description}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
