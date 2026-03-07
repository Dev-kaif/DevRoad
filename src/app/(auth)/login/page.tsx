"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Github, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    async function handleEmail(e: React.FormEvent) {
        e.preventDefault();
        setLoading("email");
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
            toast.error(error.message);
            setLoading(null);
        } else {
            router.push("/roadmap");
        }
    }

    async function handleGithub() {
        setLoading("github");
        await authClient.signIn.social({ provider: "github", callbackURL: "/roadmap" });
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">DevRoad</p>
                <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
                <p className="text-sm text-muted-foreground mt-1">Backend mastery, tracked.</p>
            </div>

            <div className="space-y-2">
                <Button variant="outline" className="w-full text-sm" onClick={handleGithub} disabled={!!loading}>
                    {loading === "github" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Github className="w-4 h-4 mr-2" />}
                    Continue with GitHub
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                    <span className="bg-background px-3 text-muted-foreground">or</span>
                </div>
            </div>

            {/* <form onSubmit={handleEmail} className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="kaif@dev.com" required className="text-sm bg-secondary border-border" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" required className="text-sm bg-secondary border-border" />
                </div>
                <Button type="submit" className="w-full text-sm" disabled={!!loading}>
                    {loading === "email" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                    Sign in with Email
                </Button>
            </form> */}

            <p className="text-center text-xs text-muted-foreground">
                No account?{" "}
                <Link href="/register" className="text-foreground hover:underline">Register</Link>
            </p>
        </div>
    );
}