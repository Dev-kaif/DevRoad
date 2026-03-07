import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import prisma from "@/lib/db";

const createSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    phaseIndex: z.number().optional(),
    phaseName: z.string().optional(),
    timeLimitMin: z.number().default(60),
    dueDate: z.string().optional(),
    aiGenerated: z.boolean().default(false),
});

const updateSchema = z.object({
    id: z.string(),
    status: z.enum(["pending", "in_progress", "completed", "skipped"]).optional(),
    startedAt: z.string().optional(),
    completedAt: z.string().optional(),
    timeSpentMin: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    timeLimitMin: z.number().optional(),
    dueDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const assignments = await prisma.assignment.findMany({
        where: {
            userId: session.user.id,
            ...(status ? { status } : {}),
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assignments });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

    const assignment = await prisma.assignment.create({
        data: {
            userId: session.user.id,
            ...parsed.data,
            dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        },
    });

    return NextResponse.json({ assignment }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

    const { id, ...data } = parsed.data;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment || assignment.userId !== session.user.id)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.assignment.update({
        where: { id },
        data: {
            ...data,
            startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
            completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
    });

    return NextResponse.json({ assignment: updated });
}

export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment || assignment.userId !== session.user.id)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true });
}