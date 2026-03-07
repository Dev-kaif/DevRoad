import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import AssignmentsClient from "@/components/assignments/AssignmentsClient";


export default async function AssignmentsPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const assignments = await prisma.assignment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return <AssignmentsClient initialAssignments={assignments} />;
}
