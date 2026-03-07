import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const phases = [
  { n: "01", name: "CPU Arch", color: "#e8c547" },
  { n: "02", name: "OS", color: "#e8c547" },
  { n: "03", name: "Linux", color: "#e8c547" },
  { n: "04", name: "Networks", color: "#e8c547" },
  { n: "05", name: "Node.js", color: "#47e8a0" },
  { n: "06", name: "TypeScript", color: "#47e8a0" },
  { n: "07", name: "Databases", color: "#e847a0" },
  { n: "08", name: "Modeling", color: "#e847a0" },
  { n: "09", name: "Auth", color: "#e84747" },
  { n: "10", name: "API Design", color: "#4788e8" },
  { n: "11", name: "Observability", color: "#4788e8" },
  { n: "12", name: "Caching", color: "#a047e8" },
  { n: "13", name: "Queues", color: "#a047e8" },
  { n: "14", name: "WebSockets", color: "#47e8e8" },
  { n: "15", name: "Distributed", color: "#ff6b35" },
  { n: "16", name: "Event-Driven", color: "#ff6b35" },
  { n: "17", name: "Performance", color: "#ff4757" },
  { n: "18", name: "DevOps", color: "#e8a047" },
  { n: "19", name: "Cloud", color: "#ffa502" },
  { n: "20", name: "Sys Design", color: "#ff6b35" },
  { n: "21", name: "DSA", color: "#ff6b35" },
  { n: "22", name: "Build", color: "#00ff88" },
];

const features = [
  { icon: "◈", color: "#e8c547", bg: "#e8c54718", title: "Structured Roadmap", desc: "22 phases from CPU architecture → OS internals → distributed systems → system design. Every task is something you can explain in an interview." },
  { icon: "⚡", color: "#e84747", bg: "#e8474718", title: "AI Assignments", desc: "Your Gemini key, your browser, your data. Generates specific build tasks per phase — 'Build a JWT refresh rotation system', not 'learn about auth'." },
  { icon: "◎", color: "#4788e8", bg: "#4788e818", title: "Notes + Links", desc: "Add notes per checklist item or per phase. Store Notion links, MDN docs, blog posts — attached to where you learned it." },
  { icon: "▸", color: "#47e8a0", bg: "#47e8a018", title: "Assignment Timer", desc: "Start a countdown when you begin a build task. Track how long you actually took vs your estimate. Feel every over-time minute." },
  { icon: "◐", color: "#a047e8", bg: "#a047e818", title: "Streak Tracking", desc: "Daily streak updates every time you check something off. Miss a day and you'll know about it." },
  { icon: "◻", color: "#ff6b35", bg: "#ff6b3518", title: "Built for your stack", desc: "TypeScript, Node.js, Postgres, Redis, Docker. Every build task forces you to actually own what you already ship." },
];

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/roadmap");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .land-root {
          min-height: 100vh;
          background: #060606;
          color: #e8e8e8;
          font-family: 'IBM Plex Mono', monospace;
          position: relative;
          overflow-x: hidden;
        }
        .land-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .land-root > * { position: relative; z-index: 1; }

        .logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 10px #00ff88;
          animation: glow 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 10px #00ff88; }
          50%      { box-shadow: 0 0 4px #00ff88; opacity: 0.6; }
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(52px, 9vw, 96px);
          font-weight: 800;
          line-height: 0.93;
          letter-spacing: -0.03em;
          color: #fff;
        }
        .title-ghost {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1px #444;
        }
        .title-accent {
          display: block;
          background: linear-gradient(90deg, #00ff88, #00cfff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .cta-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .btn-primary {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          padding: 13px 30px;
          background: #e8e8e8;
          color: #060606;
          border-radius: 4px;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: #00ff88; transform: translateY(-1px); }

        .btn-outline {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          padding: 7px 16px;
          border: 1px solid #222;
          border-radius: 4px;
          color: #e8e8e8;
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }
        .btn-outline:hover { border-color: #444; background: #111; }

        .btn-ghost {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #666;
          text-decoration: none;
          letter-spacing: 0.08em;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: #e8e8e8; }

        .feature-card {
          background: #060606;
          padding: 32px 28px;
          transition: background 0.2s;
        }
        .feature-card:hover { background: #0d0d0d; }

        .phase-chip {
          padding: 10px 12px;
          border-radius: 4px;
          font-size: 10px;
          color: #666;
          border: 1px solid #1e1e1e;
          transition: all 0.15s;
        }
        .phase-chip:hover { color: #aaa; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.5s 0.0s ease both; }
        .anim-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .anim-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .anim-4 { animation: fadeUp 0.5s 0.3s ease both; }

        @media (max-width: 640px) {
          .stats-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .phases-grid   { grid-template-columns: repeat(3,1fr) !important; }
          .nav-pad       { padding: 16px 20px !important; }
          .hero-pad      { padding: 64px 20px 56px !important; }
          .section-pad   { padding-left: 20px !important; padding-right: 20px !important; }
          .footer-dir    { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }
      `}</style>

      <div className="land-root">

        {/* ── Nav ── */}
        <nav className="nav-pad" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 40px", borderBottom: "1px solid #141414" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, letterSpacing: "0.05em" }}>
            <div className="logo-dot" />
            DevRoad
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/login" style={{ fontSize: 11, color: "#888", textDecoration: "none", letterSpacing: "0.08em" }}>
              Sign in
            </Link>
            <Link href="/register" className="btn-outline">Get started</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="hero-pad" style={{ maxWidth: 880, margin: "0 auto", padding: "100px 40px 80px" }}>
          <div className="anim-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#666", border: "1px solid #222", padding: "6px 12px", borderRadius: 3, marginBottom: 36 }}>
            <div style={{ width: 16, height: 1, background: "#00ff88" }} />
            8-month backend mastery program
          </div>
          <h1 className="hero-title anim-2" style={{ marginBottom: 32 }}>
            <span className="title-ghost">Stop being</span>
            <span style={{ display: "block" }}>tutorial-dependent.</span>
            <span className="title-accent">Go deep.</span>
          </h1>
          <p className="anim-3" style={{ fontSize: 13, color: "#888", lineHeight: 1.85, maxWidth: 480, marginBottom: 48 }}>
            A structured roadmap from CPU architecture to distributed systems.{" "}
            <span style={{ color: "#aaa" }}>600+ tasks, AI-generated assignments, notes per concept, streak tracking.</span>{" "}
            Built for devs who already ship but don't own what they've built.
          </p>
          <div className="anim-4" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary">Start the grind</Link>
            <Link href="/login" className="btn-ghost">Already have an account →</Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid #141414", borderBottom: "1px solid #141414" }}>
          {[
            { num: "22", label: "Phases" },
            { num: "600+", label: "Checklist items" },
            { num: "32", label: "Weeks" },
            { num: "∞", label: "AI Assignments" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: "28px 40px", borderRight: i < 3 ? "1px solid #141414" : "none" }}>
              <div className="stat-num">{s.num}</div>
              <div style={{ fontSize: 10, color: "#666", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <div className="section-pad" style={{ maxWidth: 880, margin: "80px auto 0", padding: "0 40px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", marginBottom: 24 }}>What's inside</p>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#141414", border: "1px solid #141414", borderRadius: 8, overflow: "hidden" }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ width: 32, height: 32, borderRadius: 6, background: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 20 }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#ccc", marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phases ── */}
        <div className="section-pad" style={{ maxWidth: 880, margin: "80px auto 0", padding: "0 40px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", marginBottom: 24 }}>The 22 phases</p>
          <div className="phases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
            {phases.map((p) => (
              <div key={p.n} className="phase-chip" style={{ borderColor: p.color + "22" }}>
                <div style={{ color: p.color, fontWeight: 600, fontSize: 11, marginBottom: 4 }}>{p.n}</div>
                <div style={{ fontSize: 10 }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section style={{ borderTop: "1px solid #141414", marginTop: 80, padding: "80px 40px", textAlign: "center" }}>
          <h2 className="cta-headline" style={{ marginBottom: 14 }}>Start today. Own it in 8 months.</h2>
          <p style={{ fontSize: 12, color: "#666", letterSpacing: "0.08em", marginBottom: 36 }}>
            the discomfort you feel is the learning
          </p>
          <Link href="/register" className="btn-primary">Create free account →</Link>
        </section>

        {/* ── Footer ── */}
        <footer className="footer-dir" style={{ borderTop: "1px solid #141414", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: "#444", letterSpacing: "0.1em" }}>
          <span>DEVROAD · 2026</span>
          <span>build → break → understand → repeat</span>
        </footer>

      </div>
    </>
  );
}