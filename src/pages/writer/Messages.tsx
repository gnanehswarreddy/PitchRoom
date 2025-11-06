import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

type Thread = {
  id: string;
  last_message_at: string;
  producer_id: string;
};

type Message = {
  id: string;
  body: string | null;
  created_at: string;
  sender_id: string;
};

const Messages = () => {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const initialThreadParam = searchParams.get("threadId");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const threadsQuery = useQuery<{ id: string; last_message_at: string; producer_id: string; }[]>({
    queryKey: ["writer-threads"],
    queryFn: async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("message_threads")
        .select("id, last_message_at, producer_id")
        .eq("writer_id", user.id)
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (initialThreadParam) {
      setSelectedThreadId(initialThreadParam);
      return;
    }
    if (!selectedThreadId && threadsQuery.data && threadsQuery.data.length > 0) {
      setSelectedThreadId(threadsQuery.data[0].id);
    }
  }, [threadsQuery.data, selectedThreadId, initialThreadParam]);

  const messagesQuery = useQuery<Message[]>({
    queryKey: ["thread-messages", selectedThreadId],
    enabled: !!selectedThreadId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, body, created_at, sender_id")
        .eq("thread_id", selectedThreadId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as Message[]) || [];
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedThreadId || !draft.trim()) return;
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("messages").insert({
        body: draft.trim(),
        sender_id: user.id,
        thread_id: selectedThreadId,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      setDraft("");
      await qc.invalidateQueries({ queryKey: ["thread-messages", selectedThreadId] });
      await qc.invalidateQueries({ queryKey: ["writer-threads"] });
    },
  });

  const selectedThread = useMemo(() =>
    threadsQuery.data?.find(t => t.id === selectedThreadId) || null,
  [threadsQuery.data, selectedThreadId]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Link to="/writer/dashboard">
            <Button variant="ghost" className="glass-button mb-2">← Back to Dashboard</Button>
          </Link>
        </div>
        <div className="glass-card p-4 md:col-span-1">
          <h2 className="font-heading font-bold mb-3">Threads</h2>
          {threadsQuery.isLoading && <p className="text-muted-foreground">Loading threads...</p>}
          {threadsQuery.error && <p className="text-destructive">Failed to load threads.</p>}
          <div className="space-y-2">
            {threadsQuery.data?.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedThreadId(t.id)}
                className={`w-full text-left p-3 rounded-md border transition ${
                  selectedThreadId === t.id ? "bg-accent" : "bg-background hover:bg-accent"
                }`}
              >
                <div className="text-sm font-medium">Thread #{t.id.slice(0, 8)}</div>
                <div className="text-xs text-muted-foreground">Last: {new Date(t.last_message_at).toLocaleString()}</div>
              </button>
            ))}
            {threadsQuery.data && threadsQuery.data.length === 0 && (
              <p className="text-muted-foreground">No threads yet.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-4 md:col-span-2 flex flex-col h-[70vh]">
          <div className="mb-3">
            <h2 className="font-heading font-bold">Conversation</h2>
            {selectedThread && (
              <p className="text-sm text-muted-foreground">Thread #{selectedThread.id.slice(0, 8)}</p>
            )}
          </div>
          <div className="flex-1 overflow-auto space-y-3 pr-2">
            {messagesQuery.isLoading && <p className="text-muted-foreground">Loading messages...</p>}
            {messagesQuery.data?.map((m) => (
              <div key={m.id} className="p-3 rounded-md border">
                <div className="text-xs text-muted-foreground mb-1">{new Date(m.created_at).toLocaleString()}</div>
                <div>{m.body}</div>
              </div>
            ))}
            {messagesQuery.data && messagesQuery.data.length === 0 && (
              <p className="text-muted-foreground">No messages yet. Say hi!</p>
            )}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); sendMutation.mutate(); }}
          >
            <Input
              placeholder="Type a message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button type="submit" disabled={!draft.trim() || sendMutation.isPending}>
              {sendMutation.isPending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
