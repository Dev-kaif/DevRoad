import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RoadmapClient from "@/components/roadmap/RoadmapClient";
import prisma from "@/lib/db";

export default async function RoadmapPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const [checklistItems, streak] = await Promise.all([
        prisma.checklistItem.findMany({
            where: { userId: session.user.id },
            select: { itemKey: true, completed: true },
        }),
        prisma.streak.findUnique({ where: { userId: session.user.id } }),
    ]);

    const completedKeys = new Set(
        checklistItems.filter((i) => i.completed).map((i) => i.itemKey)
    );

    return (
        <RoadmapClient
            initialCompleted={Array.from(completedKeys)}
            streak={streak ? { current: streak.currentStreak, longest: streak.longestStreak, total: streak.totalDaysActive } : null}
        />
    );
}