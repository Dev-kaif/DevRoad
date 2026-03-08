import ProfileClient from "@/components/profile/ProfileClient";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const userId = session.user.id;

    // Fetch all data in parallel
    const [user, checklistItems, assignments, notes, streak] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, image: true, createdAt: true },
        }),
        prisma.checklistItem.findMany({
            where: { userId, completed: true },
            select: { itemKey: true, completedAt: true },
        }),
        prisma.assignment.findMany({
            where: { userId },
            select: {
                status: true,
                aiGenerated: true,
                completedAt: true,
                timeSpentMin: true,
            },
        }),
        prisma.note.findMany({
            where: { userId },
            select: { scope: true },
        }),
        prisma.streak.findUnique({
            where: { userId },
            select: {
                currentStreak: true,
                longestStreak: true,
                totalDaysActive: true,
                lastActiveDate: true,
            },
        }),
    ]);

    if (!user) redirect("/login");

    const stats = {
        user: {
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt.toISOString(),
        },
        streak: streak
            ? {
                current: streak.currentStreak,
                longest: streak.longestStreak,
                total: streak.totalDaysActive,
                lastActiveDate: streak.lastActiveDate?.toISOString() ?? null,
            }
            : null,
        checklist: {
            completedKeys: checklistItems.map((i) => i.itemKey),
            completedDates: checklistItems
                .filter((i) => i.completedAt)
                .map((i) => i.completedAt!.toISOString()),
        },
        assignments: {
            total: assignments.length,
            completed: assignments.filter((a) => a.status === "completed").length,
            inProgress: assignments.filter((a) => a.status === "in_progress").length,
            skipped: assignments.filter((a) => a.status === "skipped").length,
            totalTimeSpentMin: assignments.reduce((sum, a) => sum + (a.timeSpentMin ?? 0), 0),
            aiGenerated: assignments.filter((a) => a.aiGenerated).length,
            completedDates: assignments
                .filter((a) => a.completedAt)
                .map((a) => a.completedAt!.toISOString()),
        },
        notes: {
            total: notes.length,
            phaseNotes: notes.filter((n) => n.scope === "phase").length,
            itemNotes: notes.filter((n) => n.scope === "item").length,
        },
    };

    return <ProfileClient stats={stats} />;
}