import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import prisma from "@/lib/db";

const createNoteSchema = z.object({
    scope: z.enum(["phase", "item"]),
    refKey: z.string(),
    title: z.string().optional(),
    content: z.string().min(1),
    links: z.array(z.string().url()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
});

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope");
    const refKey = searchParams.get("refKey");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (scope) where.scope = scope;
    if (refKey) where.refKey = refKey;

    const notes = await prisma.note.findMany({
        where,
        orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

    const note = await prisma.note.create({
        data: { userId: session.user.id, ...parsed.data },
    });

    return NextResponse.json({ note }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, ...data } = body;

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== session.user.id)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.note.update({ where: { id }, data });
    return NextResponse.json({ note: updated });
}

export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== session.user.id)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true });
}