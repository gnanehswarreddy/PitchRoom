import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const NewScript = () => {
    const { toast } = useToast();
    const [title, setTitle] = useState("");
    const [logline, setLogline] = useState("");
    const [genre, setGenre] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const estimatePages = (text: string) => {
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.round(words / 250));
    };

    const createScript = useMutation({
        mutationFn: async () => {
            const { data: { user }, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;
            if (!user) throw new Error("Not authenticated");

            const pageCount = content ? estimatePages(content) : null;

            const { error } = await supabase.from("scripts").insert({
                title,
                logline: logline || null,
                genre: genre || null,
                page_count: pageCount,
                visibility: "public",
                writer_id: user.id,
            });
            if (error) throw error;

            // Note: File/content persistence can be wired to Supabase Storage later.
        },
        onSuccess: () => {
            toast({ title: "Script created", description: "Your script metadata was saved." });
            setTitle("");
            setLogline("");
            setGenre("");
            setContent("");
            setFile(null);
        },
        onError: (err: any) => {
            toast({ title: "Failed to create script", description: err.message, variant: "destructive" });
        },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createScript.mutate();
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto glass-card p-8">
                <div className="mb-4">
                    <Link to="/writer/dashboard">
                        <Button variant="ghost" className="glass-button">← Back to Dashboard</Button>
                    </Link>
                </div>
                <h1 className="text-3xl font-heading font-bold mb-4">Upload Script</h1>
                <p className="text-muted-foreground mb-6">Upload a file or paste content. We'll save your script details now; file/content storage can be added next.</p>

                <form className="grid gap-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., The Great Heist" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="logline">Logline</Label>
                        <Input id="logline" value={logline} onChange={(e) => setLogline(e.target.value)} placeholder="One-sentence hook" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="genre">Genre</Label>
                        <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g., Thriller" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Paste Content (optional)</Label>
                        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Paste your script content here" />
                        {content && (
                            <p className="text-sm text-muted-foreground">Estimated pages: {estimatePages(content)}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">Upload File (optional)</Label>
                        <Input id="file" type="file" accept=".pdf,.txt,.md" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={!title || createScript.isPending}>
                            {createScript.isPending ? "Saving..." : "Save Script"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewScript;
