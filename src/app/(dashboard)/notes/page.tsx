import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import NotesClient from "@/components/notes/NotesClient";

export default async function NotesPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const notes = await prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
    });



    return <NotesClient initialNotes={notes} />;
}