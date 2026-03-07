"use client";

import { useState } from "react";
import { Search, ExternalLink, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { roadmap } from "@/lib/data";

interface Note {
    id: string;
    scope: string;
    refKey: string;
    title?: string | null;
    content: string;
    links: string[];
    tags: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

function getLabel(note: Note): string {
    if (note.scope === "phase") {
        const idx = parseInt(note.refKey.replace("phase-", ""));
        return roadmap[idx]?.title ?? note.refKey;
    }
    // item key: "phaseIdx-sectionTitle-itemIdx"
    const parts = note.refKey.split("-");
    const phaseIdx = parseInt(parts[0]);
    const itemIdx = parseInt(parts[parts.length - 1]);
    const sectionTitle = parts.slice(1, -1).join("-");
    const section = roadmap[phaseIdx]?.sections.find((s) => s.title === sectionTitle);
    return section?.items[itemIdx]?.text.slice(0, 60) ?? note.refKey;
}

function getPhaseColor(note: Note): string {
    const idx = note.scope === "phase"
        ? parseInt(note.refKey.replace("phase-", ""))
        : parseInt(note.refKey.split("-")[0]);
    return roadmap[idx]?.color ?? "#888";
}

export default function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
    const [notes] = useState<Note[]>(initialNotes);
    const [search, setSearch] = useState("");
    const [scopeFilter, setScopeFilter] = useState<"all" | "phase" | "item">("all");

    const filtered = notes.filter((n) => {
        const matchScope = scopeFilter === "all" || n.scope === scopeFilter;
        const q = search.toLowerCase();
        const matchSearch = !q || n.content.toLowerCase().includes(q) ||
            n.title?.toLowerCase().includes(q) ||
            n.links.some((l) => l.toLowerCase().includes(q));
        return matchScope && matchSearch;
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">all notes</p>
                        <h1 className="text-lg font-semibold mt-0.5">Notes</h1>
                    </div>
                    <span className="text-sm text-muted-foreground">{notes.length} notes</span>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notes…" className="pl-8 h-8 text-xs bg-secondary border-border" />
                    </div>
                    <div className="flex gap-1">
                        {(["all", "phase", "item"] as const).map((s) => (
                            <button key={s} onClick={() => setScopeFilter(s)}
                                className={cn("text-[10px] px-2.5 py-1 rounded border uppercase tracking-wider transition-colors",
                                    scopeFilter === s ? "border-border bg-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notes grid */}
            <div className="px-6 py-4">
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <StickyNote className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No notes yet.</p>
                        <p className="text-xs mt-1">Add notes from the Roadmap page by clicking "note" on any item.</p>
                    </div>
                )}

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
                    {filtered.map((note) => {
                        const color = getPhaseColor(note);
                        const label = getLabel(note);

                        return (
                            <div key={note.id} className="break-inside-avoid border border-border rounded-md p-3 space-y-2 bg-card hover:border-border/80 transition-colors">
                                {/* Scope tag */}
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{note.scope}</span>
                                    <span className="text-[10px] text-muted-foreground truncate flex-1">{label}</span>
                                </div>

                                {note.title && (
                                    <p className="text-xs font-semibold leading-snug">{note.title}</p>
                                )}

                                <p className="text-[12px] text-foreground/80 leading-relaxed whitespace-pre-wrap">{note.content}</p>

                                {note.links.length > 0 && (
                                    <div className="space-y-1 pt-1 border-t border-border/50">
                                        {note.links.map((link, i) => (
                                            <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline">
                                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                                <span className="truncate">{link.replace(/^https?:\/\//, "")}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                <p className="text-[10px] text-muted-foreground/50">
                                    {new Date(note.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}