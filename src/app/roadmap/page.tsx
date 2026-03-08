import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import RoadmapShell from "@/components/roadmap/RoadmapShell";
import prisma from "@/lib/db";

export default async function RoadmapPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    let completedKeys: string[] = [];
    let streak: { current: number; longest: number; total: number } | null = null;

    if (session) {
        const [checklistItems, streakData] = await Promise.all([
            prisma.checklistItem.findMany({
                where: { userId: session.user.id },
                select: { itemKey: true, completed: true },
            }),
            prisma.streak.findUnique({ where: { userId: session.user.id } }),
        ]);

        completedKeys = checklistItems.filter((i) => i.completed).map((i) => i.itemKey);
        streak = streakData
            ? { current: streakData.currentStreak, longest: streakData.longestStreak, total: streakData.totalDaysActive }
            : null;
    }

    return (
        <RoadmapShell
            user={session?.user ?? null}
            initialCompleted={completedKeys}
            streak={streak}
        />
    );
}