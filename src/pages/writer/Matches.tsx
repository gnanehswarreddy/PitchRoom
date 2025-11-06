import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["writer-matches"],
    queryFn: async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("matches")
        .select("id, created_at, score, state, producer_id, script_id")
        .eq("writer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const navigate = useNavigate();

  const openThread = useMutation({
    mutationFn: async (m: any) => {
      // Find existing thread or create one for writer-producer pair
      const { data: existing, error: findErr } = await supabase
        .from("message_threads")
        .select("id")
        .eq("writer_id", m.writer_id || (await supabase.auth.getUser()).data.user?.id)
        .eq("producer_id", m.producer_id)
        .limit(1)
        .maybeSingle();
      if (!findErr && existing) return existing.id;

      const { data: inserted, error: insertErr } = await supabase
        .from("message_threads")
        .insert({ writer_id: m.writer_id, producer_id: m.producer_id, last_message_at: new Date().toISOString() })
        .select("id")
        .single();
      if (insertErr) throw insertErr;
      return inserted.id;
    },
    onSuccess: (threadId: string) => {
      navigate(`/writer/messages?threadId=${threadId}`);
    },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link to="/writer/dashboard">
            <Button variant="ghost" className="glass-button">← Back to Dashboard</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">Matches</h1>
        {isLoading && <p className="text-muted-foreground">Loading matches...</p>}
        {error && <p className="text-destructive">Failed to load matches.</p>}
        {!isLoading && !error && (
          <div className="grid gap-4">
            {matches && matches.length > 0 ? (
              matches.map((m) => (
                <div key={m.id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Match #{m.id.slice(0, 8)}</div>
                    <div className="text-sm text-muted-foreground">State: {m.state || "suggested"} • Score: {m.score ?? "-"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    Producer: {m.producer_id.slice(0, 8)}
                    <br />
                    Script: {m.script_id ? m.script_id.slice(0, 8) : "-"}
                    <div className="mt-2">
                      <Button variant="outline" className="glass-button" onClick={() => openThread.mutate(m)}>
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No matches yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
