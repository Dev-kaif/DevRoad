"use client";

import { useMemo } from "react";
import {
    Flame, Zap, Target, Clock,
    TrendingUp, Calendar, Award, BarChart2, BookOpen, Wand2
} from "lucide-react";
import { roadmap } from "@/lib/data";


interface ProfileStats {
    user: {
        name: string;
        email: string;
        image?: string | null;
        createdAt: string | Date;
    };
    streak: {
        current: number;
        longest: number;
        total: number;
        lastActiveDate?: string | Date | null;
    } | null;
    checklist: {
        completedKeys: string[];
        completedDates: string[];
    };
    assignments: {
        total: number;
        completed: number;
        inProgress: number;
        skipped: number;
        totalTimeSpentMin: number;
        aiGenerated: number;
        completedDates: string[];
    };
    notes: {
        total: number;
        phaseNotes: number;
        itemNotes: number;
    };
}


function formatDate(d: string | Date): string {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatMinutes(min: number): string {
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
}

function getInitials(name: string): string {
    return name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}


const CELL = 11;
const GAP = 3;

function ActivityHeatmap({ checklistDates, assignmentDates }: {
    checklistDates: string[];
    assignmentDates: string[];
}) {
    const counts = useMemo(() => {
        const map: Record<string, number> = {};
        [...checklistDates, ...assignmentDates].forEach(raw => {
            const day = raw.slice(0, 10);
            map[day] = (map[day] ?? 0) + 1;
        });
        return map;
    }, [checklistDates, assignmentDates]);

    const { weeks, monthLabels } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDay = new Date(today);
        startDay.setDate(startDay.getDate() - 364);
        startDay.setDate(startDay.getDate() - startDay.getDay());

        const weeks: { date: string; count: number }[][] = [];
        const monthLabels: { label: string; weekIdx: number }[] = [];
        const cur = new Date(startDay);

        for (let w = 0; w < 53; w++) {
            const week: { date: string; count: number }[] = [];
            for (let d = 0; d < 7; d++) {
                const iso = cur.toISOString().slice(0, 10);
                week.push({ date: iso, count: counts[iso] ?? 0 });
                cur.setDate(cur.getDate() + 1);
            }
            weeks.push(week);
            const sunday = new Date(week[0].date);
            if (sunday.getDate() <= 7) {
                monthLabels.push({
                    label: sunday.toLocaleDateString("en-IN", { month: "short" }),
                    weekIdx: w,
                });
            }
        }
        return { weeks, monthLabels };
    }, [counts]);

    const maxCount = useMemo(() => Math.max(1, ...Object.values(counts)), [counts]);

    function cellColor(count: number): string {
        if (count === 0) return "rgba(255,255,255,0.07)";
        const t = count / maxCount;
        if (t < 0.25) return "#166534";
        if (t < 0.5) return "#15803d";
        if (t < 0.75) return "#16a34a";
        return "#22c55e";
    }

    const totalW = weeks.length * (CELL + GAP) - GAP;

    return (
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
            {/* Month labels */}
            <div style={{ position: "relative", height: 16, width: totalW, marginBottom: 6 }}>
                {monthLabels.map(({ label, weekIdx }) => (
                    <span key={weekIdx} style={{
                        position: "absolute",
                        left: weekIdx * (CELL + GAP),
                        fontSize: 9,
                        color: "hsl(var(--muted-foreground))",
                        whiteSpace: "nowrap",
                    }}>
                        {label}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: "flex", gap: GAP, width: totalW }}>
                {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                        {week.map((day) => (
                            <div
                                key={day.date}
                                title={`${day.date}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`}
                                style={{
                                    width: CELL,
                                    height: CELL,
                                    borderRadius: 2,
                                    backgroundColor: cellColor(day.count),
                                    flexShrink: 0,
                                    cursor: "default",
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 10 }}>
                <span style={{ fontSize: 9, color: "hsl(var(--muted-foreground))" }}>Less</span>
                {[0, 0.2, 0.5, 0.8, 1].map((v, i) => (
                    <div key={i} style={{
                        width: CELL, height: CELL, borderRadius: 2, flexShrink: 0,
                        backgroundColor: cellColor(v === 0 ? 0 : Math.ceil(v * maxCount)),
                    }} />
                ))}
                <span style={{ fontSize: 9, color: "hsl(var(--muted-foreground))" }}>More</span>
            </div>
        </div>
    );
}


function PhaseBreakdown({ completedKeys }: { completedKeys: string[] }) {
    const completedSet = new Set(completedKeys);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
            {roadmap.map((phase, pi) => {
                const total = phase.sections.reduce((a, s) => a + s.items.length, 0);
                const done = phase.sections.reduce((acc, s) =>
                    acc + s.items.filter((_, ii) => completedSet.has(`${pi}-${s.title}-${ii}`)).length, 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                    <div key={pi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, width: 24, flexShrink: 0, color: phase.color }}>
                            {phase.phase}
                        </span>
                        <div style={{ flex: 1, height: 5, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{
                                height: "100%", width: `${pct}%`,
                                backgroundColor: phase.color,
                                borderRadius: 3,
                                transition: "width 0.7s ease",
                            }} />
                        </div>
                        <span style={{ fontSize: 9, color: "hsl(var(--muted-foreground))", width: 68, textAlign: "right", flexShrink: 0 }}>
                            {done}/{total} · {pct}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
}


function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
}) {
    return (
        <div style={{
            border: "1px solid hsl(var(--border))",
            borderRadius: 6,
            padding: "12px 16px",
            backgroundColor: "hsl(var(--card))",
            display: "flex",
            flexDirection: "column",
            gap: 6,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon style={{ width: 12, height: 12, color: color ?? "hsl(var(--muted-foreground))" }} />
                <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(var(--muted-foreground))" }}>{label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color }}>{value}</div>
            {sub && <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{sub}</div>}
        </div>
    );
}


function WeeklyActivity({ checklistDates, assignmentDates }: {
    checklistDates: string[];
    assignmentDates: string[];
}) {
    const weeks = useMemo(() => {
        const result: { label: string; checklist: number; assignments: number }[] = [];
        for (let i = 11; i >= 0; i--) {
            const end = new Date();
            end.setDate(end.getDate() - i * 7);
            const start = new Date(end);
            start.setDate(start.getDate() - 6);
            const s = start.toISOString().slice(0, 10);
            const e = end.toISOString().slice(0, 10);

            result.push({
                label: start.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
                checklist: checklistDates.filter(d => { const day = d.slice(0, 10); return day >= s && day <= e; }).length,
                assignments: assignmentDates.filter(d => { const day = d.slice(0, 10); return day >= s && day <= e; }).length,
            });
        }
        return result;
    }, [checklistDates, assignmentDates]);

    const maxVal = Math.max(1, ...weeks.map(w => w.checklist + w.assignments));
    const BAR_H = 96;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Bars */}
            <div style={{ display: "flex", gap: 4, height: BAR_H, alignItems: "flex-end" }}>
                {weeks.map((w, i) => {
                    const total = w.checklist + w.assignments;
                    const clPct = total > 0 ? (w.checklist / maxVal) * 100 : 0;
                    const asgnPct = total > 0 ? (w.assignments / maxVal) * 100 : 0;

                    return (
                        <div key={i} title={`${w.label}: ${w.checklist} items, ${w.assignments} assignments`}
                            style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1, height: "100%", cursor: "default" }}>
                            {asgnPct > 0 && (
                                <div style={{ height: `${asgnPct}%`, minHeight: 2, backgroundColor: "#a855f7", borderRadius: "2px 2px 0 0", flexShrink: 0 }} />
                            )}
                            {clPct > 0 && (
                                <div style={{
                                    height: `${clPct}%`, minHeight: 2,
                                    backgroundColor: "#22c55e",
                                    borderRadius: asgnPct > 0 ? 0 : "2px 2px 0 0",
                                    flexShrink: 0,
                                }} />
                            )}
                            {total === 0 && (
                                <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 2, flexShrink: 0 }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* x-axis labels */}
            <div style={{ display: "flex", gap: 4 }}>
                {weeks.map((w, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 8, color: "hsl(var(--muted-foreground))", overflow: "hidden" }}>
                        {i % 3 === 0 ? w.label : ""}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16 }}>
                {[
                    { color: "#22c55e", label: "Roadmap items" },
                    { color: "#a855f7", label: "Assignments" },
                ].map(({ color, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: color, flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


function CircleProgress({ pct }: { pct: number }) {
    const R = 26;
    const circ = 2 * Math.PI * R;
    return (
        <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
            <svg viewBox="0 0 64 64" width={72} height={72} style={{ transform: "rotate(-90deg)", display: "block" }}>
                <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="32" cy="32" r={R} fill="none" stroke="#22c55e" strokeWidth="4"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.7s ease" }}
                />
            </svg>
            <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
            }}>
                {pct}%
            </div>
        </div>
    );
}


export default function ProfileClient({ stats }: { stats: ProfileStats }) {
    const { user, streak, checklist, assignments, notes } = stats;

    const totalItems = roadmap.reduce((a, p) => a + p.sections.reduce((b, s) => b + s.items.length, 0), 0);
    const overallPct = Math.round((checklist.completedKeys.length / totalItems) * 100);
    const memberDays = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const avgTime = assignments.completed > 0 ? Math.round(assignments.totalTimeSpentMin / assignments.completed) : 0;
    const completionRate = assignments.total > 0 ? Math.round((assignments.completed / assignments.total) * 100) : 0;
    const pendingCount = Math.max(0, assignments.total - assignments.completed - assignments.inProgress - assignments.skipped);

    const achievements = [
        { label: "First Step", desc: "Complete your first roadmap item", unlocked: checklist.completedKeys.length >= 1, icon: "🚀" },
        { label: "Week Warrior", desc: "7-day streak", unlocked: (streak?.longest ?? 0) >= 7, icon: "⚡" },
        { label: "Assignment Master", desc: "Complete 10 assignments", unlocked: assignments.completed >= 10, icon: "🏆" },
        { label: "Note Taker", desc: "Write 5 notes", unlocked: notes.total >= 5, icon: "📝" },
        { label: "Halfway There", desc: "50% roadmap complete", unlocked: overallPct >= 50, icon: "🎯" },
        { label: "AI Native", desc: "Generate 5 AI assignments", unlocked: assignments.aiGenerated >= 5, icon: "🤖" },
        { label: "Month Strong", desc: "30-day streak", unlocked: (streak?.longest ?? 0) >= 30, icon: "🔥" },
    ];

    const card: React.CSSProperties = {
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        padding: 20,
        backgroundColor: "hsl(var(--card))",
    };

    const sectionTitle: React.CSSProperties = {
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "hsl(var(--muted-foreground))",
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            {/* Header */}
            <div style={{
                position: "sticky", top: 0, zIndex: 10,
                backgroundColor: "hsl(var(--background))",
                borderBottom: "1px solid hsl(var(--border))",
                padding: "16px 24px",
            }}>
                <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "hsl(var(--muted-foreground))", textTransform: "uppercase" }}>30-day grind</p>
                <h1 style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>Profile</h1>
            </div>

            <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

                {/* ── User card ──────────────────────────────────────────── */}
                <div style={{
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    padding: 20,
                    backgroundColor: "hsl(var(--card))",
                    display: "flex", alignItems: "center", gap: 20,
                }}>
                    {user.image ? (
                        <img src={user.image} alt={user.name} style={{
                            width: 56, height: 56, borderRadius: "50%",
                            border: "1px solid hsl(var(--border))", objectFit: "cover", flexShrink: 0,
                        }} />
                    ) : (
                        <div style={{
                            width: 56, height: 56, borderRadius: "50%",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--secondary))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 20, fontWeight: 700,
                            color: "hsl(var(--muted-foreground))",
                            flexShrink: 0,
                        }}>
                            {getInitials(user.name)}
                        </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{user.name}</h2>
                        <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 3 }}>{user.email}</p>
                        <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                            Member since {formatDate(user.createdAt)} · {memberDays} days
                        </p>
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            {(streak?.current ?? 0) > 0 && (
                                <span style={{ fontSize: 11, color: "#f97316" }}>🔥 {streak!.current}-day streak</span>
                            )}
                            <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>
                                {checklist.completedKeys.length}/{totalItems} items done
                            </span>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <CircleProgress pct={overallPct} />
                        <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>overall</span>
                    </div>
                </div>

                {/* ── Quick stats ────────────────────────────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
                    <StatCard icon={Flame} label="Streak" value={streak?.current ?? 0} sub={`${streak?.longest ?? 0} longest`} color="#f97316" />
                    <StatCard icon={Target} label="Completed" value={checklist.completedKeys.length} sub={`of ${totalItems} items`} color="#22c55e" />
                    <StatCard icon={Zap} label="Assignments" value={assignments.completed} sub={`of ${assignments.total} total`} color="#3b82f6" />
                    <StatCard icon={Clock} label="Time Spent" value={formatMinutes(assignments.totalTimeSpentMin)} sub={avgTime ? `avg ${formatMinutes(avgTime)}` : "on assignments"} color="#a855f7" />
                    <StatCard icon={BookOpen} label="Notes" value={notes.total} sub={`${notes.phaseNotes} phase · ${notes.itemNotes} item`} color="#eab308" />
                    <StatCard icon={Wand2} label="AI Generated" value={assignments.aiGenerated} sub="assignments" color="#ec4899" />
                </div>

                {/* ── Heatmap ────────────────────────────────────────────── */}
                <div style={card}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Calendar style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                            <span style={sectionTitle}>Activity — Last 365 Days</span>
                        </div>
                        <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{streak?.total ?? 0} active days total</span>
                    </div>
                    <ActivityHeatmap
                        checklistDates={checklist.completedDates}
                        assignmentDates={assignments.completedDates}
                    />
                </div>

                {/* ── Weekly + Phase ─────────────────────────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <BarChart2 style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                            <span style={sectionTitle}>Weekly Activity — Last 12 Weeks</span>
                        </div>
                        <WeeklyActivity
                            checklistDates={checklist.completedDates}
                            assignmentDates={assignments.completedDates}
                        />
                    </div>

                    <div style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <TrendingUp style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                            <span style={sectionTitle}>Phase Progress</span>
                        </div>
                        <PhaseBreakdown completedKeys={checklist.completedKeys} />
                    </div>
                </div>

                {/* ── Assignment breakdown ──────────────────────────────── */}
                <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Zap style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                        <span style={sectionTitle}>Assignment Breakdown</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                        {[
                            { label: "Pending", value: pendingCount, color: "hsl(var(--muted-foreground))" },
                            { label: "In Progress", value: assignments.inProgress, color: "#3b82f6" },
                            { label: "Completed", value: assignments.completed, color: "#22c55e" },
                            { label: "Skipped", value: assignments.skipped, color: "#6b7280" },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{
                                border: "1px solid hsl(var(--border))",
                                borderRadius: 6, padding: "12px 16px", textAlign: "center",
                            }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                                <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 6 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                    {assignments.total > 0 && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>Completion rate</span>
                                <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{completionRate}%</span>
                            </div>
                            <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${completionRate}%`, backgroundColor: "#3b82f6", borderRadius: 3, transition: "width 0.7s ease" }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Streak + Achievements ─────────────────────────────── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Flame style={{ width: 14, height: 14, color: "#f97316" }} />
                            <span style={sectionTitle}>Streak Details</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, textAlign: "center" }}>
                            {[
                                { label: "Current", value: streak?.current ?? 0, color: "#f97316" },
                                { label: "Longest", value: streak?.longest ?? 0, color: "#f59e0b" },
                                { label: "Total Days", value: streak?.total ?? 0, color: "#eab308" },
                            ].map(({ label, value, color }) => (
                                <div key={label}>
                                    <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                                    <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 6 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                        {streak?.lastActiveDate && (
                            <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>
                                Last active: {formatDate(streak.lastActiveDate)}
                            </p>
                        )}
                    </div>

                    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Award style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                            <span style={sectionTitle}>Achievements</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {achievements.map(({ label, desc, unlocked, icon }) => (
                                <div key={label} style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "8px 12px",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: 6,
                                    opacity: unlocked ? 1 : 0.35,
                                    backgroundColor: unlocked ? "hsl(var(--card))" : "transparent",
                                }}>
                                    <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 11, fontWeight: 600 }}>{label}</div>
                                        <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{desc}</div>
                                    </div>
                                    {unlocked && (
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e", flexShrink: 0 }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}