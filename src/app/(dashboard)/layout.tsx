import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardShell from "@/components/layout/DashboardShell";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    return <DashboardShell user={session.user}>{children}</DashboardShell>;
}