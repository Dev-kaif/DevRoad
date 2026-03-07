"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Plus, Wand2, Play, CheckCircle, Clock, Loader2, Trash2, Timer, Key, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { roadmap } from "@/lib/data";

const GEMINI_KEY_LS = "devroad_gemini_key";

interface Assignment {
    id: string;
    title: string;
    description: string;
    phaseIndex?: number | null;
    phaseName?: string | null;
    timeLimitMin: number;
    dueDate?: string | Date | null;
    status: string;
    aiGenerated: boolean;
    startedAt?: string | Date | null;
    completedAt?: string | Date | null;
    timeSpentMin?: number | null;
    createdAt: string | Date;
}

const statusColors: Record<string, string> = {
    pending: "text-muted-foreground",
    in_progress: "text-blue-400",
    completed: "text-green-400",
    skipped: "text-muted-foreground/50",
};

const statusLabels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    skipped: "Skipped",
};

export default function AssignmentsClient({ initialAssignments }: { initialAssignments: Assignment[] }) {
    const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
    const [createOpen, setCreateOpen] = useState(false);
    const [activeTimer, setActiveTimer] = useState<{ id: string; startTime: number; limit: number } | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [filter, setFilter] = useState("all");
    const [generating, setGenerating] = useState(false);

    // Gemini key
    const [geminiKey, setGeminiKey] = useState<string>("");
    const [keyInput, setKeyInput] = useState("");
    const [keyVisible, setKeyVisible] = useState(false);
    const [keyDialogOpen, setKeyDialogOpen] = useState(false);

    // Create form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timeLimitMin, setTimeLimitMin] = useState("60");
    const [phaseIndex, setPhaseIndex] = useState<string>("");
    const [aiContext, setAiContext] = useState("");
    const [saving, setSaving] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Load key from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(GEMINI_KEY_LS);
        if (stored) setGeminiKey(stored);
    }, []);

    useEffect(() => {
        if (activeTimer) {
            timerRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - activeTimer.startTime) / 1000));
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [activeTimer]);

    function saveKey() {
        const trimmed = keyInput.trim();
        if (!trimmed.startsWith("AIza")) {
            toast.error("Doesn't look like a valid Gemini key (should start with AIza)");
            return;
        }
        localStorage.setItem(GEMINI_KEY_LS, trimmed);
        setGeminiKey(trimmed);
        setKeyInput("");
        setKeyDialogOpen(false);
        toast.success("Key saved — stays in your browser only");
    }

    function removeKey() {
        localStorage.removeItem(GEMINI_KEY_LS);
        setGeminiKey("");
        toast.success("Key removed");
    }

    function formatTime(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }

    async function generateWithAI() {
        if (!geminiKey) {
            setKeyDialogOpen(true);
            return;
        }

        setGenerating(true);
        try {
            const phase = phaseIndex ? roadmap[parseInt(phaseIndex)] : null;
            const phaseContext = phase
                ? `The user is studying: "${phase.title}" (${phase.tag}). Topics covered include: ${phase.sections.flatMap((s) => s.items.map((i) => i.text)).slice(0, 8).join(", ")}.`
                : "General backend development concepts.";

            const prompt = `You are a senior backend engineer creating a coding assignment for a self-taught developer learning backend fundamentals.

${phaseContext}
${aiContext ? `Additional context: ${aiContext}` : ""}

Stack: TypeScript, Node.js, Next.js, Postgres, Redis, Docker.

Create ONE focused coding assignment that:
- Can be completed in 30–120 minutes
- Builds something small but complete (not "learn about X", but "build X")
- Is specific enough that they know exactly what to do

Return ONLY valid JSON, no markdown, no extra text:
{
  "title": "short imperative title e.g. 'Build a sliding window rate limiter with Redis'",
  "description": "3-5 sentences. What to build, specific requirements, acceptance criteria.",
  "timeLimitMin": 60,
  "phaseName": "${phase?.title ?? "General"}"
}`;

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                }
            );

            if (!res.ok) {
                if (res.status === 400 || res.status === 403) {
                    toast.error("Invalid API key — check it and try again");
                    setKeyDialogOpen(true);
                } else {
                    const err = await res.json().catch(() => ({}));
                    toast.error(err?.error?.message ?? "Gemini request failed");
                }
                return;
            }

            const data = await res.json();
            const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            const clean = text.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(clean);

            setTitle(parsed.title ?? "");
            setDescription(parsed.description ?? "");
            setTimeLimitMin(String(parsed.timeLimitMin ?? 60));
            toast.success("Assignment generated!");
        } catch {
            toast.error("Failed to generate — check your key or try again");
        } finally {
            setGenerating(false);
        }
    }

    async function createAssignment() {
        if (!title.trim() || !description.trim()) return;
        setSaving(true);
        try {
            const pi = phaseIndex ? parseInt(phaseIndex) : undefined;
            const res = await fetch("/api/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    timeLimitMin: parseInt(timeLimitMin),
                    phaseIndex: pi,
                    phaseName: pi !== undefined ? roadmap[pi]?.title : undefined,
                }),
            });
            const data = await res.json();
            setAssignments((prev) => [data.assignment, ...prev]);
            resetForm();
            setCreateOpen(false);
            toast.success("Assignment created");
        } catch {
            toast.error("Failed to create");
        } finally {
            setSaving(false);
        }
    }

    function resetForm() {
        setTitle(""); setDescription(""); setTimeLimitMin("60"); setPhaseIndex(""); setAiContext("");
    }

    async function startAssignment(id: string, limitMin: number) {
        await updateAssignment(id, { status: "in_progress", startedAt: new Date().toISOString() });
        setActiveTimer({ id, startTime: Date.now(), limit: limitMin * 60 });
        setElapsed(0);
    }

    async function completeAssignment(id: string) {
        const spent = activeTimer ? Math.floor(elapsed / 60) : undefined;
        await updateAssignment(id, {
            status: "completed",
            completedAt: new Date().toISOString(),
            timeSpentMin: spent,
        });
        if (activeTimer?.id === id) {
            setActiveTimer(null);
            setElapsed(0);
        }
        toast.success("Assignment completed! 🔥");
    }

    async function updateAssignment(id: string, data: Partial<Assignment>) {
        try {
            const res = await fetch("/api/assignments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...data }),
            });
            const result = await res.json();
            setAssignments((prev) => prev.map((a) => (a.id === id ? result.assignment : a)));
        } catch {
            toast.error("Failed to update");
        }
    }

    async function deleteAssignment(id: string) {
        try {
            await fetch(`/api/assignments?id=${id}`, { method: "DELETE" });
            setAssignments((prev) => prev.filter((a) => a.id !== id));
            toast.success("Deleted");
        } catch {
            toast.error("Failed to delete");
        }
    }

    const filtered = filter === "all" ? assignments : assignments.filter((a) => a.status === filter);
    const completed = assignments.filter((a) => a.status === "completed").length;

    return (
        <div className="min-h-screen">

            {/* ── Header ── */}
            <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">30-day grind</p>
                        <h1 className="text-lg font-semibold mt-0.5">Assignments</h1>
                    </div>
                    <div className="flex items-center gap-3">

                        {/* Gemini key pill */}
                        <button
                            onClick={() => setKeyDialogOpen(true)}
                            className={cn(
                                "flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border transition-all",
                                geminiKey
                                    ? "border-green-500/30 text-green-400 hover:border-green-500/50"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                            )}
                        >
                            <Key className="w-2.5 h-2.5" />
                            {geminiKey ? "Gemini ready" : "Add Gemini key"}
                        </button>

                        <div className="text-right">
                            <div className="text-sm font-semibold">
                                {completed}<span className="text-muted-foreground text-[10px]">/{assignments.length}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground">completed</div>
                        </div>

                        <Button size="sm" className="text-xs" onClick={() => setCreateOpen(true)}>
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Assignment
                        </Button>
                    </div>
                </div>

                {/* Active timer */}
                {activeTimer && (() => {
                    const a = assignments.find((x) => x.id === activeTimer.id);
                    const over = elapsed > activeTimer.limit;
                    return (
                        <div className={cn(
                            "mt-3 flex items-center gap-3 px-3 py-2 rounded border text-sm",
                            over ? "border-red-500/30 bg-red-500/5 text-red-400" : "border-blue-500/30 bg-blue-500/5 text-blue-400"
                        )}>
                            <Timer className="w-4 h-4" />
                            <span className="font-semibold font-mono text-base">{formatTime(elapsed)}</span>
                            <span className="text-xs opacity-70">/ {a?.timeLimitMin}m</span>
                            <span className="text-xs flex-1 truncate opacity-70">{a?.title}</span>
                            {over && <span className="text-xs font-semibold">OVER TIME</span>}
                            <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => completeAssignment(activeTimer.id)}>
                                <CheckCircle className="w-3 h-3 mr-1" /> Done
                            </Button>
                        </div>
                    );
                })()}

                {/* Filter tabs */}
                <div className="flex gap-1 mt-3">
                    {["all", "pending", "in_progress", "completed", "skipped"].map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={cn(
                                "text-[10px] px-2.5 py-1 rounded border transition-colors uppercase tracking-wider",
                                filter === s ? "border-border bg-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                            )}>
                            {s === "all" ? `all (${assignments.length})` : s.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── List ── */}
            <div className="px-6 py-4 space-y-2">
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <ClipboardList className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No assignments yet.</p>
                        <p className="text-xs mt-1">Create one manually or generate with Gemini.</p>
                    </div>
                )}

                {filtered.map((assignment) => {
                    const isActive = activeTimer?.id === assignment.id;
                    const phase = assignment.phaseIndex !== null && assignment.phaseIndex !== undefined
                        ? roadmap[assignment.phaseIndex] : null;

                    return (
                        <div key={assignment.id} className={cn(
                            "border rounded-md p-4 group transition-all",
                            assignment.status === "completed" ? "border-border/50 opacity-60" : "border-border hover:border-border/80",
                            isActive && "border-blue-500/40 bg-blue-500/5"
                        )}>
                            <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider", statusColors[assignment.status])}>
                                            {statusLabels[assignment.status]}
                                        </span>
                                        {assignment.aiGenerated && (
                                            <span className="text-[10px] text-purple-400 flex items-center gap-0.5">
                                                <Wand2 className="w-2.5 h-2.5" /> AI
                                            </span>
                                        )}
                                        {phase && (
                                            <span className="text-[10px]" style={{ color: phase.color + "aa" }}>
                                                {phase.phase} · {phase.title}
                                            </span>
                                        )}
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                            <Clock className="w-2.5 h-2.5" /> {assignment.timeLimitMin}m
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-medium leading-snug">{assignment.title}</h3>
                                    <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
                                    {assignment.timeSpentMin && (
                                        <p className="text-[10px] text-green-400 mt-1.5">
                                            Completed in {assignment.timeSpentMin}m
                                            {assignment.timeSpentMin > assignment.timeLimitMin ? " (over time)" : " ✓"}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {assignment.status === "pending" && (
                                        <Button variant="outline" size="sm" className="h-7 text-[10px]"
                                            onClick={() => startAssignment(assignment.id, assignment.timeLimitMin)}>
                                            <Play className="w-3 h-3 mr-1" /> Start
                                        </Button>
                                    )}
                                    {assignment.status === "in_progress" && !isActive && (
                                        <Button variant="outline" size="sm" className="h-7 text-[10px]"
                                            onClick={() => completeAssignment(assignment.id)}>
                                            <CheckCircle className="w-3 h-3 mr-1" /> Complete
                                        </Button>
                                    )}
                                    {assignment.status !== "completed" && (
                                        <button onClick={() => deleteAssignment(assignment.id)}
                                            className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Gemini Key Dialog ── */}
            <Dialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen}>
                <DialogContent className="max-w-sm bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-sm flex items-center gap-2">
                            <Key className="w-3.5 h-3.5" /> Gemini API Key
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Your key is saved in <strong className="text-foreground">your browser's localStorage only</strong> — it never touches our servers. Gemini calls go directly from your browser to Google.
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Get a free key at{" "}
                            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                                className="text-blue-400 hover:underline">
                                aistudio.google.com/apikey
                            </a>
                        </p>

                        {geminiKey ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/5 border border-green-500/20 rounded-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                    <span className="text-[11px] text-green-400 flex-1">Key saved locally</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {geminiKey.slice(0, 8)}···{geminiKey.slice(-4)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="text-xs flex-1"
                                        onClick={() => { setGeminiKey(""); setKeyInput(""); }}>
                                        Replace
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive"
                                        onClick={removeKey}>
                                        <X className="w-3 h-3 mr-1" /> Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label className="text-[10px]">Paste your key</Label>
                                <div className="relative">
                                    <Input
                                        value={keyInput}
                                        onChange={(e) => setKeyInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && saveKey()}
                                        type={keyVisible ? "text" : "password"}
                                        placeholder="AIzaSy..."
                                        className="text-xs h-8 bg-background border-border pr-8 font-mono"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setKeyVisible((v) => !v)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <Button size="sm" className="text-xs w-full" onClick={saveKey} disabled={!keyInput.trim()}>
                                    Save key locally
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Create Dialog ── */}
            <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
                <DialogContent className="max-w-lg bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-sm">New Assignment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* AI Generate */}
                        <div className="border border-border rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Generate with Gemini</p>
                                {geminiKey ? (
                                    <span className="flex items-center gap-1 text-[10px] text-green-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> key ready
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => { setCreateOpen(false); setKeyDialogOpen(true); }}
                                        className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <Key className="w-2.5 h-2.5" /> add key first
                                    </button>
                                )}
                            </div>

                            <Select value={phaseIndex} onValueChange={(v) => setPhaseIndex(v ?? "")}>
                                <SelectTrigger className="h-8 text-xs bg-background border-border">
                                    <SelectValue placeholder="Select phase (optional)" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    {roadmap.map((p, i) => (
                                        <SelectItem key={i} value={String(i)} className="text-xs">
                                            {p.phase} · {p.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                value={aiContext}
                                onChange={(e) => setAiContext(e.target.value)}
                                placeholder="Any specific focus? e.g. 'Redis caching patterns'"
                                className="h-8 text-xs bg-background border-border"
                            />

                            <Button variant="outline" size="sm" className="text-xs w-full" onClick={generateWithAI} disabled={generating}>
                                {generating
                                    ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                    : <Wand2 className="w-3 h-3 mr-1.5" />
                                }
                                {geminiKey ? "Generate Assignment" : "Add Gemini key to generate"}
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                            <div className="relative flex justify-center text-[11px]">
                                <span className="bg-card px-2 text-muted-foreground">or write manually</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Title *</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Build a JWT refresh token system" className="text-xs h-8 bg-background border-border" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Description *</Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What exactly to build, requirements, acceptance criteria…"
                                    rows={4} className="text-xs bg-background border-border resize-none" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Time limit (minutes)</Label>
                                <Input value={timeLimitMin} onChange={(e) => setTimeLimitMin(e.target.value)}
                                    type="number" min="10" max="480" className="text-xs h-8 bg-background border-border" />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <Button size="sm" className="text-xs" onClick={createAssignment}
                                disabled={saving || !title.trim() || !description.trim()}>
                                {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Plus className="w-3 h-3 mr-1" />}
                                Create
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

function ClipboardList({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
    );
}