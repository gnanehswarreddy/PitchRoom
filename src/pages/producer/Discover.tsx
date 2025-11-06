import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Discover = () => {
  const scriptsQuery = useQuery({
    queryKey: ["discover-scripts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Always fetch public scripts
      const publicPromise = supabase
        .from("scripts")
        .select("id, title, genre, logline, created_at, writer_id, visibility")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(50);

      // Also fetch my scripts if authenticated
      const minePromise = user
        ? supabase
            .from("scripts")
            .select("id, title, genre, logline, created_at, writer_id, visibility")
            .eq("writer_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50)
        : Promise.resolve({ data: [], error: null } as any);

      const [pubRes, mineRes] = await Promise.all([publicPromise, minePromise]);
      if (pubRes.error) {
        // If public query fails (RLS), surface empty array but do not crash
        console.error("Discover public scripts error:", pubRes.error);
      }
      if (mineRes && (mineRes as any).error) {
        console.error("Discover my scripts error:", (mineRes as any).error);
      }
      const pub = pubRes.data || [];
      const mine = (mineRes as any).data || [];
      const map = new Map<string, any>();
      [...pub, ...mine].forEach((s: any) => map.set(s.id, s));
      return [...map.values()].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 50);
    },
  });

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const qc = useQueryClient();
  const { toast } = useToast();

  const genres = useMemo(() => {
    const set = new Set<string>();
    (scriptsQuery.data || []).forEach((s: any) => { if (s.genre) set.add(s.genre); });
    return ["all", ...Array.from(set).sort()];
  }, [scriptsQuery.data]);

  const filtered = useMemo(() => {
    let list = (scriptsQuery.data || []) as any[];
    if (genre !== "all") list = list.filter((s) => s.genre === genre);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.logline || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [scriptsQuery.data, search, genre]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const likeMutation = useMutation({
    mutationFn: async (script: any) => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr; if (!user) throw new Error("Please log in as a producer to like scripts.");
      const { error } = await supabase.from("matches").insert({
        producer_id: user.id,
        writer_id: script.writer_id,
        script_id: script.id,
        state: "liked",
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast({ title: "Saved", description: "Added to your matches." });
      await qc.invalidateQueries({ queryKey: ["producer-matches"] });
    },
    onError: (err: any) => {
      toast({ title: "Could not save match", description: err.message, variant: "destructive" });
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
        <h1 className="text-3xl font-heading font-bold mb-2">Discover Scripts</h1>
        <p className="text-muted-foreground mb-6">Browse published scripts. Use filters to narrow results.</p>

        <div className="glass-card p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title or logline..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            />
          </div>
          <div>
            <Select value={genre} onValueChange={(v) => { setPage(1); setGenre(v); }}>
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>{g === "all" ? "All genres" : g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {scriptsQuery.isLoading && <p className="text-muted-foreground">Loading scripts...</p>}
        {scriptsQuery.error && <p className="text-destructive">Failed to load scripts.</p>}
        {!scriptsQuery.isLoading && !scriptsQuery.error && (
          <div className="grid gap-4">
            {filtered.length === 0 && (
              <p className="text-muted-foreground">No scripts available yet.</p>
            )}
            {pageItems.map((s) => (
              <div key={s.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground">{s.genre || "Unknown genre"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                </div>
                {s.logline && <p className="mt-2 text-sm">{s.logline}</p>}
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    className="glass-button"
                    onClick={() => likeMutation.mutate(s)}
                    disabled={likeMutation.isPending}
                  >
                    {likeMutation.isPending ? "Saving..." : "Like"}
                  </Button>
                  <Link to="/producer/matches">
                    <Button variant="ghost" className="glass-button">View Matches</Button>
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
                <div className="flex gap-2">
                  <Button variant="outline" className="glass-button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                  <Button variant="outline" className="glass-button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
