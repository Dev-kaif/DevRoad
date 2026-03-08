"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, ClipboardList, StickyNote, LogOut, Flame, UserIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
    user: { name?: string | null; email: string; image?: string | null };
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

const links = [
    { href: "/roadmap", label: "Roadmap", icon: Map },
    { href: "/profile", label: "Profile", icon: UserIcon },
    { href: "/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/notes", label: "Notes", icon: StickyNote },
];

export default function Sidebar({ user, mobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("sidebar-collapsed") === "true";
    });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", String(collapsed));
    }, [collapsed]);

    // Close mobile drawer on route change
    useEffect(() => {
        onMobileClose?.();
    }, [pathname]);

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/login");
    }

    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user.email[0].toUpperCase();

    const NavContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
        <>
            {/* Logo */}
            <div className={cn(
                "border-b border-border flex items-center",
                collapsed && !inDrawer ? "px-3 py-5 justify-center" : "px-4 py-5 justify-between"
            )}>
                <div className={cn("flex items-center gap-2 min-w-0", collapsed && !inDrawer && "justify-center")}>
                    <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                    {(!collapsed || inDrawer) && (
                        <div className="min-w-0">
                            <span className="text-sm font-semibold tracking-tight">DevRoad</span>
                            <p className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none mt-0.5">Backend Mastery</p>
                        </div>
                    )}
                </div>
                {/* Desktop collapse toggle */}
                {!inDrawer && (
                    <button
                        onClick={() => setCollapsed((v) => !v)}
                        className="text-muted-foreground hover:text-foreground transition-colors ml-1 shrink-0"
                    >
                        {collapsed
                            ? <ChevronRight className="w-3.5 h-3.5" />
                            : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>
                )}
                {/* Mobile drawer close */}
                {inDrawer && (
                    <button onClick={onMobileClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className={cn("flex-1 py-4 space-y-0.5", collapsed && !inDrawer ? "px-1.5" : "px-2")}>
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link key={href} href={href}
                            title={collapsed && !inDrawer ? label : undefined}
                            className={cn(
                                "flex items-center rounded-md text-sm transition-colors",
                                collapsed && !inDrawer ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
                                active
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}>
                            <Icon className="w-4 h-4 shrink-0" />
                            {(!collapsed || inDrawer) && label}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className={cn("border-t border-border", collapsed && !inDrawer ? "px-1.5 py-4" : "px-3 py-4")}>
                {collapsed && !inDrawer ? (
                    <div className="flex flex-col items-center gap-3">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={user.image ?? undefined} />
                            <AvatarFallback className="text-[10px] bg-secondary">{initials}</AvatarFallback>
                        </Avatar>
                        <button onClick={handleSignOut} title="Sign out"
                            className="text-muted-foreground hover:text-foreground transition-colors">
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-6 h-6 shrink-0">
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
                    </>
                )}
            </div>
        </>
    );

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Mobile drawer */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-56 flex flex-col bg-card border-r border-border transition-transform duration-200 md:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <NavContent inDrawer />
            </aside>

            {/* Desktop sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col border-r border-border bg-card shrink-0 transition-all duration-200",
                collapsed ? "w-14" : "w-52"
            )}>
                <NavContent />
            </aside>
        </>
    );
}