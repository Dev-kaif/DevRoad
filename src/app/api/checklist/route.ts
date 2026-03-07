import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await prisma.checklistItem.findMany({
        where: { userId: session.user.id },
        select: { itemKey: true, completed: true, completedAt: true },
    });

    return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { itemKey, phaseIndex, sectionTitle, itemIndex, completed } = body;

    const item = await prisma.checklistItem.upsert({
        where: { userId_itemKey: { userId: session.user.id, itemKey } },
        update: {
            completed,
            completedAt: completed ? new Date() : null,
        },
        create: {
            userId: session.user.id,
            itemKey,
            phaseIndex,
            sectionTitle,
            itemIndex,
            completed,
            completedAt: completed ? new Date() : null,
        },
    });

    // Update streak
    if (completed) {
        await updateStreak(session.user.id);
    }

    return NextResponse.json({ item });
}

async function updateStreak(userId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const streak = await prisma.streak.findUnique({ where: { userId } });

    if (!streak) {
        await prisma.streak.create({
            data: { userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today, totalDaysActive: 1 },
        });
        return;
    }

    const lastActive = streak.lastActiveDate
        ? new Date(streak.lastActiveDate.getFullYear(), streak.lastActiveDate.getMonth(), streak.lastActiveDate.getDate())
        : null;

    const diffDays = lastActive
        ? Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    let newStreak = streak.currentStreak;
    let totalDays = streak.totalDaysActive;

    if (diffDays === null || diffDays > 1) {
        newStreak = 1;
        totalDays += 1;
    } else if (diffDays === 1) {
        newStreak += 1;
        totalDays += 1;
    }
    // diffDays === 0 means same day, no change

    await prisma.streak.update({
        where: { userId },
        data: {
            currentStreak: newStreak,
            longestStreak: Math.max(streak.longestStreak, newStreak),
            lastActiveDate: today,
            totalDaysActive: totalDays,
        },
    });
}