"use client";

import { useState } from "react";
import { createContext, useContext } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface MobileMenuContextType {
    openMobileMenu: () => void;
}

export const MobileMenuContext = createContext<MobileMenuContextType>({ openMobileMenu: () => { } });
export const useMobileMenu = () => useContext(MobileMenuContext);

interface Props {
    user: { name?: string | null; email: string; image?: string | null };
    children: React.ReactNode;
}

export default function DashboardShell({ user, children }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <MobileMenuContext.Provider value={{ openMobileMenu: () => setMobileOpen(true) }}>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar
                    user={user}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </MobileMenuContext.Provider>
    );
}