"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import RoadmapClient from "@/components/roadmap/RoadmapClient";

interface Props {
    user: { name?: string | null; email: string; image?: string | null } | null;
    initialCompleted: string[];
    streak: { current: number; longest: number; total: number } | null;
}

export default function RoadmapShell({ user, initialCompleted, streak }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {user && (
                <Sidebar
                    user={user}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />
            )}
            <main className="flex-1 overflow-y-auto">
                <RoadmapClient
                    initialCompleted={initialCompleted}
                    streak={streak}
                    isAuthed={!!user}
                    onMobileMenuOpen={() => setMobileOpen(true)}
                />
            </main>
        </div>
    );
}