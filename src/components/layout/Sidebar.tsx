"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, ClipboardList, StickyNote, LogOut, Flame, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
    user: { name?: string | null; email: string; image?: string | null };
}

const links = [
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/profile", label: "Profile", icon: UserIcon },
    { href: "/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/notes", label: "Notes", icon: StickyNote },
];

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/login");
    }

    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user.email[0].toUpperCase();

    return (
        <aside className="w-52 flex flex-col border-r border-border bg-card shrink-0">
            {/* Logo */}
            <div className="px-4 py-5 border-b border-border">
                <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-semibold tracking-tight">DevRoad</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 tracking-widest uppercase">Backend Mastery</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-0.5">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        pathname === href || pathname.startsWith(href)
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}>
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* User */}
            <div className="px-3 py-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback className="text-[10px] bg-secondary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{user.name ?? "Dev"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
                <button onClick={handleSignOut}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full px-1">
                    <LogOut className="w-3 h-3" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}