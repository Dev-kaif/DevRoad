"use client";

import { useState, useCallback } from "react";
import { roadmap, getItemKey, getTotalItems, getTotalBuildItems } from "@/lib/data";
import { toast } from "sonner";
import { ChevronDown, Flame, Hammer, Lock, Menu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import NoteDialog from "@/components/notes/NoteDialog";
import Link from "next/link";

interface Props {
    initialCompleted: string[];
    streak: { current: number; longest: number; total: number } | null;
    isAuthed: boolean;
    onMobileMenuOpen?: () => void; // NEW: triggers sidebar drawer from parent shell
}

export default function RoadmapClient({ initialCompleted, streak, isAuthed, onMobileMenuOpen }: Props) {
    const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted));
    const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
    const [noteOpen, setNoteOpen] = useState<{ scope: "phase" | "item"; refKey: string; label: string } | null>(null);
    const [saving, setSaving] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<string>("all");

    const totalItems = getTotalItems();
    const totalBuild = getTotalBuildItems();
    const doneItems = completed.size;
    const doneBuild = Array.from(completed).filter((k) => {
        const parts = k.split("-");
        const pi = parseInt(parts[0]);
        const ii = parseInt(parts[parts.length - 1]);
        const sTitle = parts.slice(1, -1).join("-");
        const phase = roadmap[pi];
        const section = phase?.sections.find((s) => s.title === sTitle);
        return section?.items[ii]?.build;
    }).length;

    const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    const toggleItem = useCallback(async (
        itemKey: string,
        phaseIndex: number,
        sectionTitle: string,
        itemIndex: number
    ) => {
        if (!isAuthed) {
            toast("Sign in to track your progress", {
                action: { label: "Sign in", onClick: () => window.location.href = "/login" },
            });
            return;
        }
        const isCompleted = !completed.has(itemKey);
        setCompleted((prev) => {
            const next = new Set(prev);
            if (isCompleted) next.add(itemKey);
            else next.delete(itemKey);
            return next;
        });
        setSaving((prev) => new Set(prev).add(itemKey));
        try {
            const res = await fetch("/api/checklist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemKey, phaseIndex, sectionTitle, itemIndex, completed: isCompleted }),
            });
            if (!res.ok) throw new Error();
        } catch {
            setCompleted((prev) => {
                const next = new Set(prev);
                if (isCompleted) next.delete(itemKey);
                else next.add(itemKey);
                return next;
            });
            toast.error("Failed to save");
        } finally {
            setSaving((prev) => {
                const next = new Set(prev);
                next.delete(itemKey);
                return next;
            });
        }
    }, [completed, isAuthed]);

    const togglePhase = (idx: number) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const scrollToPhase = (i: number) => {
        setExpanded((prev) => new Set(prev).add(i));
        setFilter("all");
        setTimeout(() => document.getElementById(`phase-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };

    const tags = ["all", ...Array.from(new Set(roadmap.map((p) => p.tag)))];
    const filtered = filter === "all" ? roadmap : roadmap.filter((p) => p.tag === filter);

    const phaseStats = roadmap.map((phase, pi) => {
        const keys = phase.sections.flatMap((s) => s.items.map((_, ii) => getItemKey(pi, s.title, ii)));
        const done = keys.filter((k) => completed.has(k)).length;
        return { done, total: keys.length };
    });

    return (
        <div className="min-h-screen pb-24">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="px-4 sm:px-6 py-3 sm:py-4">

                    {/* Top row */}
                    <div className="flex items-center justify-between gap-3">

                        {/* Left: hamburger (mobile only, inline) + title */}
                        <div className="flex items-center gap-2.5 min-w-0">
                            {isAuthed && (
                                <button
                                    onClick={onMobileMenuOpen}
                                    className="md:hidden shrink-0 p-1 -ml-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Menu className="w-4 h-4" />
                                </button>
                            )}
                            <div className="min-w-0">
                                <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase hidden sm:block">
                                    8-month program &middot; 22 phases
                                </p>
                                <h1 className="text-base sm:text-lg font-semibold leading-tight">Backend Mastery Roadmap</h1>
                            </div>
                        </div>

                        {/* Right: stats or auth buttons */}
                        <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                            {isAuthed && streak && streak.current > 0 && (
                                <div className="flex items-center gap-1 text-orange-400">
                                    <Flame className="w-3.5 h-3.5" />
                                    <span className="text-sm font-semibold">{streak.current}</span>
                                    <span className="text-[10px] text-muted-foreground hidden sm:inline">day streak</span>
                                </div>
                            )}

                            {isAuthed ? (
                                <div className="flex items-center gap-3 sm:gap-5">
                                    <div className="text-right">
                                        <div className="text-xl sm:text-2xl font-semibold leading-none">
                                            {pct}<span className="text-xs sm:text-sm text-muted-foreground">%</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">{doneItems}/{totalItems}</div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <div className="flex items-center gap-1 text-sm font-semibold text-red-400">
                                            <Hammer className="w-3.5 h-3.5" />{doneBuild}
                                            <span className="text-muted-foreground font-normal text-[10px]">/{totalBuild}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">builds</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login"
                                        className="hidden sm:inline-block text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 border border-border rounded">
                                        Sign in
                                    </Link>
                                    <Link href="/register"
                                        className="text-[11px] px-2.5 sm:px-3 py-1.5 bg-foreground text-background rounded font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                                        Get started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress bar */}
                    {isAuthed && <Progress value={pct} className="mt-2.5 h-[3px]" />}

                    {/* Phase dots — scrollable */}
                    <div className="flex gap-1 mt-2.5 overflow-x-auto scrollbar-none">
                        {roadmap.map((p, i) => {
                            const { done, total } = phaseStats[i];
                            const full = done === total && isAuthed;
                            const partial = done > 0 && !full && isAuthed;
                            return (
                                <button key={i} onClick={() => scrollToPhase(i)}
                                    style={{ borderColor: full || partial ? p.color + (partial ? "55" : "ff") : undefined }}
                                    className={cn(
                                        "text-[10px] px-1.5 sm:px-2 py-0.5 rounded border transition-all shrink-0",
                                        full ? "text-black" : partial ? "text-muted-foreground" : "border-border text-muted-foreground hover:border-muted-foreground"
                                    )}>
                                    {p.phase}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tag filter — scrollable */}
                    <div className="flex gap-1 mt-1.5 overflow-x-auto scrollbar-none">
                        {tags.map((tag) => (
                            <button key={tag} onClick={() => setFilter(tag)}
                                className={cn(
                                    "text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider transition-colors shrink-0",
                                    filter === tag ? "border-border bg-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Phases */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 space-y-1.5">
                {filtered.map((phase) => {
                    const phaseIdx = roadmap.indexOf(phase);
                    const { done, total } = phaseStats[phaseIdx];
                    const isOpen = expanded.has(phaseIdx);
                    const phasePct = Math.round((done / total) * 100);

                    return (
                        <div key={phaseIdx} id={`phase-${phaseIdx}`}>
                            <button onClick={() => togglePhase(phaseIdx)} className="w-full text-left">
                                <div className={cn(
                                    "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border transition-all",
                                    isOpen ? "bg-card rounded-t-md border-b-0" : "bg-card/50 rounded-md hover:bg-card"
                                )}
                                    style={{ borderColor: isOpen ? phase.color + "22" : "hsl(var(--border))" }}>

                                    <span className="text-[11px] font-semibold shrink-0" style={{ color: phase.color }}>{phase.phase}</span>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                            <span className="text-xs sm:text-sm font-medium leading-tight">{phase.title}</span>
                                            <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider hidden sm:inline">{phase.tag}</span>
                                            <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:inline">· {phase.duration}</span>
                                        </div>
                                        {isOpen && (
                                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{phase.why}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                        {isAuthed && (
                                            <>
                                                <div className="w-10 sm:w-16 h-1 bg-border rounded-full overflow-hidden hidden xs:block">
                                                    <div className="h-full rounded-full transition-all"
                                                        style={{ width: `${phasePct}%`, backgroundColor: phase.color }} />
                                                </div>
                                                <span className="text-[10px] text-muted-foreground w-6 sm:w-8 text-right">{done}/{total}</span>
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNoteOpen({ scope: "phase", refKey: `phase-${phaseIdx}`, label: phase.title });
                                                }}
                                                    className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 border border-transparent hover:border-border rounded transition-all hidden sm:block">
                                                    note
                                                </button>
                                            </>
                                        )}
                                        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
                                    </div>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="border rounded-b-md overflow-hidden" style={{ borderColor: phase.color + "18" }}>
                                    {phase.sections.map((section, si) => (
                                        <div key={si}>
                                            <div className={cn(
                                                "px-3 sm:px-4 py-1.5 sm:py-2 border-b text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.15em]",
                                                si > 0 ? "border-t" : "",
                                                "bg-background/50 border-border"
                                            )}
                                                style={{ color: section.items[0]?.build ? phase.color : "hsl(var(--muted-foreground))" }}>
                                                {section.title}
                                            </div>

                                            {section.items.map((item, ii) => {
                                                const key = getItemKey(phaseIdx, section.title, ii);
                                                const isDone = completed.has(key);
                                                const isSaving = saving.has(key);
                                                const isBuild = item.build;

                                                return (
                                                    <div key={ii}
                                                        className={cn(
                                                            "flex items-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-border/50 group transition-colors",
                                                            isAuthed ? "cursor-pointer" : "cursor-default",
                                                            isDone ? "bg-card/30" : isAuthed ? "hover:bg-card/20 active:bg-card/30" : "hover:bg-card/10"
                                                        )}
                                                        onClick={() => toggleItem(key, phaseIdx, section.title, ii)}>

                                                        {isAuthed ? (
                                                            <div className={cn(
                                                                "mt-0.5 shrink-0 transition-all w-3.5 h-3.5 border flex items-center justify-center",
                                                                isBuild ? "rounded-full" : "rounded-sm",
                                                                isDone ? "border-transparent" : isBuild ? "border-current" : "border-border group-hover:border-muted-foreground",
                                                                isSaving && "opacity-50"
                                                            )}
                                                                style={{
                                                                    backgroundColor: isDone ? phase.color : "transparent",
                                                                    borderColor: isDone ? phase.color : isBuild ? phase.color + "66" : undefined,
                                                                    color: phase.color,
                                                                }}>
                                                                {isDone && (
                                                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                                        <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="mt-0.5 shrink-0 w-3.5 h-3.5 flex items-center justify-center opacity-0 group-hover:opacity-40 transition-opacity">
                                                                <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                                                            </div>
                                                        )}

                                                        <span className={cn(
                                                            "text-[11px] sm:text-[12px] leading-relaxed flex-1",
                                                            isDone ? "text-muted-foreground/40 line-through" : isBuild ? "text-foreground/90" : "text-foreground/70"
                                                        )}>
                                                            {item.text}
                                                        </span>

                                                        {isAuthed && (
                                                            <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNoteOpen({ scope: "item", refKey: key, label: item.text.slice(0, 60) });
                                                            }}
                                                                className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 border border-transparent hover:border-border rounded transition-all shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                                                                note
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Guest sticky CTA */}
            {!isAuthed && (
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium leading-snug">Track your progress through all 22 phases</p>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
                                Sign in to check items off, add notes, earn streaks, and generate AI assignments.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <Link href="/login"
                                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2.5 sm:px-3 py-1.5 border border-border rounded hidden sm:inline-block">
                                Sign in
                            </Link>
                            <Link href="/register"
                                className="text-[11px] px-3 sm:px-4 py-1.5 bg-foreground text-background rounded font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                                Get started free
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {isAuthed && noteOpen && (
                <NoteDialog
                    scope={noteOpen.scope}
                    refKey={noteOpen.refKey}
                    label={noteOpen.label}
                    onClose={() => setNoteOpen(null)}
                />
            )}
        </div>
    );
}