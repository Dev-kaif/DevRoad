import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {

    const session = await auth.api.getSession({ headers: await headers() });
    if (session) redirect("/roadmap");

    return (
        <div className="min-h-screen flex items-center justify-center bg-background" >
            <div className="w-full max-w-sm px-4" > {children} </div>
        </div>
    );
}