"use client";

import { useState, useCallback } from "react";
import { roadmap, getItemKey, getTotalItems, getTotalBuildItems } from "@/lib/data";
import { toast } from "sonner";
import { ChevronDown, Flame, Zap, CheckSquare, Hammer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import NoteDialog from "@/components/notes/NoteDialog";

interface Props {
    initialCompleted: string[];
    streak: { current: number; longest: number; total: number } | null;
}

export default function RoadmapClient({ initialCompleted, streak }: Props) {
    const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted));
    const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
    const [noteOpen, setNoteOpen] = useState<{ scope: "phase" | "item"; refKey: string; label: string } | null>(null);
    const [saving, setSaving] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<string>("all");

    const totalItems = getTotalItems();
    const totalBuild = getTotalBuildItems();
    const doneItems = completed.size;
    const doneBuild = Array.from(completed).filter((k) => {
        const [pi, st, ii] = k.split("-");
        const phase = roadmap[parseInt(pi)];
        const section = phase?.sections.find((s) => s.title === k.split(`${pi}-`)[1]?.split(`-${ii}`)[0]);
        const item = section?.items[parseInt(ii)];
        return item?.build;
    }).length;

    const pct = Math.round((doneItems / totalItems) * 100);

    const toggleItem = useCallback(async (
        itemKey: string,
        phaseIndex: number,
        sectionTitle: string,
        itemIndex: number
    ) => {
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
            // revert
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
    }, [completed]);

    const togglePhase = (idx: number) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const tags = ["all", ...Array.from(new Set(roadmap.map((p) => p.tag)))];
    const filtered = filter === "all" ? roadmap : roadmap.filter((p) => p.tag === filter);

    const phaseStats = roadmap.map((phase, pi) => {
        const keys = phase.sections.flatMap((s) => s.items.map((_, ii) => getItemKey(pi, s.title, ii)));
        const done = keys.filter((k) => completed.has(k)).length;
        return { done, total: keys.length };
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">6-month program</p>
                            <h1 className="text-lg font-semibold mt-0.5">Backend Mastery Roadmap</h1>
                        </div>
                        <div className="flex items-center gap-5">
                            {streak && (
                                <div className="flex items-center gap-1.5 text-orange-400">
                                    <Flame className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{streak.current}</span>
                                    <span className="text-[10px] text-muted-foreground">day streak</span>
                                </div>
                            )}
                            <div className="text-right">
                                <div className="text-2xl font-semibold leading-none">{pct}<span className="text-sm text-muted-foreground">%</span></div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{doneItems}/{totalItems}</div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-semibold text-red-400"><Hammer className="w-3.5 h-3.5" />{doneBuild}<span className="text-muted-foreground font-normal text-[10px]">/{totalBuild}</span></div>
                                <div className="text-[10px] text-muted-foreground">builds</div>
                            </div>
                        </div>
                    </div>
                    <Progress value={pct} className="mt-3 h-[3px]" />

                    {/* Phase dots */}
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                        {roadmap.map((p, i) => {
                            const { done, total } = phaseStats[i];
                            const full = done === total;
                            const partial = done > 0 && !full;
                            return (
                                <button key={i} onClick={() => {
                                    setExpanded((prev) => new Set(prev).add(i));
                                    setFilter("all");
                                    setTimeout(() => document.getElementById(`phase-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                                }}
                                    style={{ borderColor: full || partial ? p.color + (partial ? "55" : "ff") : undefined }}
                                    className={cn(
                                        "text-[10px] px-2 py-0.5 rounded border transition-all",
                                        full ? "text-black" : partial ? "text-muted-foreground" : "border-border text-muted-foreground hover:border-muted-foreground"
                                    )}
                                >
                                    {p.phase}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tag filter */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                        {tags.map((tag) => (
                            <button key={tag} onClick={() => setFilter(tag)}
                                className={cn(
                                    "text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider transition-colors",
                                    filter === tag ? "border-border bg-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Phases */}
            <div className="px-6 py-4 space-y-1.5">
                {filtered.map((phase) => {
                    const phaseIdx = roadmap.indexOf(phase);
                    const { done, total } = phaseStats[phaseIdx];
                    const isOpen = expanded.has(phaseIdx);
                    const phasePct = Math.round((done / total) * 100);

                    return (
                        <div key={phaseIdx} id={`phase-${phaseIdx}`}>
                            {/* Phase header */}
                            <button onClick={() => togglePhase(phaseIdx)} className="w-full text-left">
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-3 border transition-all",
                                    isOpen ? "bg-card rounded-t-md border-b-0" : "bg-card/50 rounded-md hover:bg-card"
                                )}
                                    style={{ borderColor: isOpen ? phase.color + "22" : "hsl(var(--border))" }}>
                                    <span className="text-[11px] font-semibold" style={{ color: phase.color }}>{phase.phase}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium">{phase.title}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{phase.tag}</span>
                                            <span className="text-[10px] text-muted-foreground">· {phase.duration}</span>
                                        </div>
                                        {isOpen && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{phase.why}</p>}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${phasePct}%`, backgroundColor: phase.color }} />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground w-8 text-right">{done}/{total}</span>
                                        <button onClick={(e) => { e.stopPropagation(); setNoteOpen({ scope: "phase", refKey: `phase-${phaseIdx}`, label: phase.title }); }}
                                            className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 border border-transparent hover:border-border rounded transition-all">
                                            note
                                        </button>
                                        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                                    </div>
                                </div>
                            </button>

                            {/* Sections */}
                            {isOpen && (
                                <div className="border rounded-b-md overflow-hidden" style={{ borderColor: phase.color + "18" }}>
                                    {phase.sections.map((section, si) => (
                                        <div key={si}>
                                            <div className={cn("px-4 py-2 border-b text-[10px] font-semibold uppercase tracking-[0.15em]",
                                                si > 0 ? "border-t" : "", "bg-background/50 border-border")}
                                                style={{ color: section.items[0]?.build ? phase.color : "hsl(var(--muted-foreground))" }}>
                                                {section.title}
                                            </div>
                                            {section.items.map((item, ii) => {
                                                const key = getItemKey(phaseIdx, section.title, ii);
                                                const isDone = completed.has(key);
                                                const isSaving = saving.has(key);
                                                const isBuild = item.build;

                                                return (
                                                    <div key={ii} className={cn(
                                                        "flex items-start gap-3 px-4 py-2.5 border-b border-border/50 group cursor-pointer transition-colors",
                                                        isDone ? "bg-card/30" : "hover:bg-card/20"
                                                    )} onClick={() => toggleItem(key, phaseIdx, section.title, ii)}>
                                                        {/* Checkbox */}
                                                        <div className={cn(
                                                            "mt-0.5 shrink-0 transition-all",
                                                            isBuild ? "rounded-full" : "rounded-sm",
                                                            "w-3.5 h-3.5 border flex items-center justify-center",
                                                            isDone
                                                                ? "border-transparent"
                                                                : isBuild
                                                                    ? "border-current group-hover:border-current"
                                                                    : "border-border group-hover:border-muted-foreground",
                                                            isSaving && "opacity-50"
                                                        )}
                                                            style={{
                                                                backgroundColor: isDone ? phase.color : "transparent",
                                                                borderColor: isDone ? phase.color : isBuild ? phase.color + "66" : undefined,
                                                                color: phase.color
                                                            }}>
                                                            {isDone && (
                                                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                                    <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        <span className={cn("text-[12px] leading-relaxed flex-1",
                                                            isDone ? "text-muted-foreground/40 line-through" : isBuild ? "text-foreground/90" : "text-foreground/70"
                                                        )}>
                                                            {item.text}
                                                        </span>

                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                            <button onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNoteOpen({ scope: "item", refKey: key, label: item.text.slice(0, 60) });
                                                            }}
                                                                className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 border border-transparent hover:border-border rounded transition-all">
                                                                note
                                                            </button>
                                                        </div>
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

            {noteOpen && (
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