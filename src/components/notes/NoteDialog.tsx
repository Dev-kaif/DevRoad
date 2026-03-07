"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, ExternalLink } from "lucide-react";

interface Note {
    id: string;
    title?: string | null;
    content: string;
    links: string[];
    tags: string[];
    updatedAt: string;
}

interface Props {
    scope: "phase" | "item";
    refKey: string;
    label: string;
    onClose: () => void;
}

export default function NoteDialog({ scope, refKey, label, onClose }: Props) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    // Form state
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [linkInput, setLinkInput] = useState("");
    const [links, setLinks] = useState<string[]>([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadNotes();
    }, [refKey]);

    async function loadNotes() {
        setLoading(true);
        try {
            const res = await fetch(`/api/notes?scope=${scope}&refKey=${encodeURIComponent(refKey)}`);
            const data = await res.json();
            setNotes(data.notes ?? []);
            if (data.notes?.length === 0) setShowForm(true);
        } catch {
            toast.error("Failed to load notes");
        } finally {
            setLoading(false);
        }
    }

    async function saveNote() {
        if (!content.trim()) return;
        setSaving(true);
        try {
            if (editing) {
                const res = await fetch("/api/notes", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editing, title, content, links }),
                });
                const data = await res.json();
                setNotes((prev) => prev.map((n) => (n.id === editing ? data.note : n)));
                toast.success("Note updated");
            } else {
                const res = await fetch("/api/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scope, refKey, title, content, links }),
                });
                const data = await res.json();
                setNotes((prev) => [data.note, ...prev]);
                toast.success("Note saved");
            }
            resetForm();
        } catch {
            toast.error("Failed to save note");
        } finally {
            setSaving(false);
        }
    }

    async function deleteNote(id: string) {
        try {
            await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
            setNotes((prev) => prev.filter((n) => n.id !== id));
            toast.success("Note deleted");
        } catch {
            toast.error("Failed to delete");
        }
    }

    function editNote(note: Note) {
        setEditing(note.id);
        setTitle(note.title ?? "");
        setContent(note.content);
        setLinks(note.links);
        setShowForm(true);
    }

    function resetForm() {
        setEditing(null);
        setTitle("");
        setContent("");
        setLinks([]);
        setLinkInput("");
        setShowForm(false);
    }

    function addLink() {
        const url = linkInput.trim();
        if (!url) return;
        try {
            new URL(url);
            setLinks((prev) => [...prev, url]);
            setLinkInput("");
        } catch {
            toast.error("Enter a valid URL");
        }
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-card border-border max-h-[80vh] flex flex-col">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-sm font-medium">
                        <span className="text-muted-foreground text-[10px] uppercase tracking-wider block mb-0.5">{scope} note</span>
                        {label}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {/* Existing notes */}
                    {!loading && notes.map((note) => (
                        <div key={note.id} className="border border-border rounded-md p-3 space-y-2 group">
                            {note.title && <p className="text-xs font-semibold">{note.title}</p>}
                            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                            {note.links.length > 0 && (
                                <div className="space-y-1">
                                    {note.links.map((link, i) => (
                                        <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline">
                                            <ExternalLink className="w-3 h-3" />
                                            {link.length > 50 ? link.slice(0, 50) + "…" : link}
                                        </a>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => editNote(note)}>edit</Button>
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive" onClick={() => deleteNote(note.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && <div className="text-center text-xs text-muted-foreground py-4">Loading…</div>}

                    {/* Add note form */}
                    {showForm ? (
                        <div className="space-y-3 border border-border rounded-md p-3">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Title (optional)</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Quick summary…" className="text-xs h-7 bg-background border-border" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Note *</Label>
                                <Textarea value={content} onChange={(e) => setContent(e.target.value)}
                                    placeholder="What did you learn? Key insight, gotcha, tip…" rows={4}
                                    className="text-xs bg-background border-border resize-none" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Links</Label>
                                <div className="flex gap-1.5">
                                    <Input value={linkInput} onChange={(e) => setLinkInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                                        placeholder="https://notion.so/…" className="text-xs h-7 bg-background border-border flex-1" />
                                    <Button variant="outline" size="sm" className="h-7 px-2" onClick={addLink}>
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                                {links.map((l, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                        <ExternalLink className="w-3 h-3 shrink-0" />
                                        <span className="truncate flex-1">{l}</span>
                                        <button onClick={() => setLinks((p) => p.filter((_, j) => j !== i))}
                                            className="text-destructive hover:text-destructive/80">×</button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" className="h-7 text-xs" onClick={saveNote} disabled={saving || !content.trim()}>
                                    {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                                    {editing ? "Update" : "Save note"}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetForm}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => setShowForm(true)}>
                            <Plus className="w-3 h-3 mr-1.5" /> Add note
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}