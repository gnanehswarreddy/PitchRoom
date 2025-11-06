import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type KPI = { scripts: number; matches: number; threads: number; messages: number };

const Analytics = () => {
  const kpiQuery = useQuery<KPI>({
    queryKey: ["writer-kpis"],
    queryFn: async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr; if (!user) throw new Error("Not authenticated");
      const [scripts, matches, threads, messages] = await Promise.all([
        supabase.from("scripts").select("id", { count: "exact", head: true }).eq("writer_id", user.id),
        supabase.from("matches").select("id", { count: "exact", head: true }).eq("writer_id", user.id),
        supabase.from("message_threads").select("id", { count: "exact", head: true }).eq("writer_id", user.id),
        supabase.from("messages").select("id", { count: "exact", head: true }).in("thread_id", (
          await supabase.from("message_threads").select("id").eq("writer_id", user.id)
        ).data?.map(t => t.id) || []),
      ]);
      return {
        scripts: scripts.count || 0,
        matches: matches.count || 0,
        threads: threads.count || 0,
        messages: messages.count || 0,
      };
    },
  });

  const messages7dQuery = useQuery<{ day: string; count: number }[]>({
    queryKey: ["writer-messages-7d"],
    queryFn: async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr; if (!user) throw new Error("Not authenticated");
      const since = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000); // include today
      since.setHours(0,0,0,0);
      const threadsRes = await supabase.from("message_threads").select("id").eq("writer_id", user.id);
      if (threadsRes.error) throw threadsRes.error;
      const threadIds = threadsRes.data?.map(t => t.id) || [];
      if (threadIds.length === 0) {
        // return empty last 7 days
        const days = [...Array(7)].map((_, i) => {
          const d = new Date(since.getTime() + i*24*60*60*1000);
          return { day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count: 0 };
        });
        return days;
      }
      const { data, error } = await supabase
        .from("messages")
        .select("id, created_at")
        .in("thread_id", threadIds)
        .gte("created_at", since.toISOString());
      if (error) throw error;
      const map = new Map<string, number>();
      for (let i=0;i<7;i++) {
        const d = new Date(since.getTime() + i*24*60*60*1000);
        const key = d.toISOString().slice(0,10);
        map.set(key, 0);
      }
      (data || []).forEach((m) => {
        const key = (m as any).created_at.slice(0,10);
        if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
      });
      const series = [...map.entries()].map(([iso, count]) => {
        const d = new Date(iso);
        return { day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count };
      });
      return series;
    },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Link to="/writer/dashboard">
            <Button variant="ghost" className="glass-button">← Back to Dashboard</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-heading font-bold">Analytics</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="text-muted-foreground text-sm">Scripts</div>
            <div className="text-3xl font-bold">{kpiQuery.data?.scripts ?? "-"}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-muted-foreground text-sm">Matches</div>
            <div className="text-3xl font-bold">{kpiQuery.data?.matches ?? "-"}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-muted-foreground text-sm">Threads</div>
            <div className="text-3xl font-bold">{kpiQuery.data?.threads ?? "-"}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-muted-foreground text-sm">Messages</div>
            <div className="text-3xl font-bold">{kpiQuery.data?.messages ?? "-"}</div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h2 className="font-heading font-bold mb-4">Messages (last 7 days)</h2>
          <ChartContainer
            config={{ messages: { label: "Messages", color: "hsl(var(--pitch-violet))" } }}
            className="w-full h-64"
          >
            <BarChart data={messages7dQuery.data || []}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Bar dataKey="count" fill="var(--color-messages)" radius={4} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
