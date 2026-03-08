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
  { icon: "◈", color: "#e8c547", bg: "#e8c54712", title: "Structured Roadmap", desc: "22 phases from CPU architecture to distributed systems. Every task is something you can explain in an interview." },
  { icon: "⚡", color: "#e84747", bg: "#e8474712", title: "AI Assignments", desc: "Your Gemini key, your browser, your data. Generates specific build tasks per phase — 'Build a JWT refresh rotation system', not 'learn about auth'." },
  { icon: "◎", color: "#4788e8", bg: "#4788e812", title: "Notes + Links", desc: "Add notes per checklist item or per phase. Store Notion links, MDN docs, blog posts — attached to where you learned it." },
  { icon: "▸", color: "#47e8a0", bg: "#47e8a012", title: "Assignment Timer", desc: "Start a countdown when you begin a build task. Track how long you actually took vs your estimate. Feel every over-time minute." },
  { icon: "◐", color: "#a047e8", bg: "#a047e812", title: "Streak Tracking", desc: "Daily streak updates every time you check something off. Miss a day and you'll know about it." },
  { icon: "◻", color: "#ff6b35", bg: "#ff6b3512", title: "Built for your stack", desc: "TypeScript, Node.js, Postgres, Redis, Docker. Every build task forces you to actually own what you already ship." },
];

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/roadmap");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .land-root {
          min-height: 100vh;
          background: #070707;
          color: #d4d4d4;
          font-family: 'IBM Plex Mono', monospace;
          position: relative;
          overflow-x: hidden;
        }
        .land-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }
        .land-root > * { position: relative; z-index: 1; }

        /* ── NAV ── */
        .land-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 58px;
          border-bottom: 1px solid #141414;
          position: sticky; top: 0; z-index: 100;
          background: rgba(7,7,7,0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 9px;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.06em; color: #e0e0e0;
          text-decoration: none;
        }
        .logo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 8px #00ff8899;
          animation: lpulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes lpulse {
          0%,100% { box-shadow: 0 0 8px #00ff8899; }
          50%      { box-shadow: 0 0 3px #00ff8844; opacity: 0.65; }
        }
        .nav-right {
          display: flex; align-items: center; gap: 6px;
        }
        /* ghost text link */
        .nav-ghost {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; color: #484848;
          text-decoration: none; letter-spacing: 0.07em;
          padding: 5px 10px; border-radius: 3px;
          transition: color 0.15s;
        }
        .nav-ghost:hover { color: #888; }
        /* separator */
        .nav-sep { width: 1px; height: 14px; background: #1e1e1e; margin: 0 2px; }
        /* Browse roadmap pill */
        .nav-roadmap {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; font-weight: 500;
          color: #00e87a; letter-spacing: 0.06em;
          text-decoration: none;
          padding: 6px 14px;
          border: 1px solid #00ff8826;
          border-radius: 3px;
          background: #00ff8809;
          display: flex; align-items: center; gap: 7px;
          transition: all 0.15s;
        }
        .nav-roadmap:hover { border-color: #00ff8850; background: #00ff8814; color: #33ff99; }
        .nav-roadmap-arr { font-size: 10px; opacity: 0.55; transition: transform 0.15s, opacity 0.15s; }
        .nav-roadmap:hover .nav-roadmap-arr { transform: translateX(2px); opacity: 1; }
        /* get started — solid */
        .nav-cta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; font-weight: 500;
          color: #070707; background: #dedede;
          text-decoration: none; letter-spacing: 0.06em;
          padding: 6px 14px; border-radius: 3px;
          border: 1px solid #dedede;
          transition: all 0.15s;
        }
        .nav-cta:hover { background: #00ff88; border-color: #00ff88; }

        /* ── HERO ── */
        .hero {
          max-width: 900px; margin: 0 auto;
          padding: 96px 40px 80px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 10px; letter-spacing: 0.28em;
          text-transform: uppercase; color: #444;
          border: 1px solid #181818; padding: 6px 14px;
          border-radius: 2px; margin-bottom: 40px;
        }
        .eyebrow-line { width: 18px; height: 1px; background: linear-gradient(90deg, #00ff88, transparent); }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(46px, 8vw, 90px);
          font-weight: 800; line-height: 0.92;
          letter-spacing: -0.03em; margin-bottom: 36px;
        }
        .title-dim  { display: block; color: transparent; -webkit-text-stroke: 1px #252525; }
        .title-main { display: block; color: #efefef; }
        .title-grad {
          display: block;
          background: linear-gradient(95deg, #00ff88 0%, #00ccff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .hero-body {
          font-size: 13px; color: #585858; line-height: 1.9;
          max-width: 455px; margin-bottom: 52px;
        }
        .hero-body em { font-style: normal; color: #888; }

        /* Joined CTA pill group */
        .cta-group {
          display: inline-flex; align-items: stretch;
          border-radius: 4px; overflow: hidden;
          border: 1px solid #222;
        }
        .cta-start {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; font-weight: 500;
          padding: 12px 26px;
          background: #e0e0e0; color: #070707;
          text-decoration: none; letter-spacing: 0.05em;
          border-right: 1px solid #333;
          transition: all 0.16s;
          display: flex; align-items: center;
        }
        .cta-start:hover { background: #00ff88; }
        .cta-browse {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; font-weight: 500;
          padding: 12px 22px;
          background: #0d0d0d; color: #00e87a;
          text-decoration: none; letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.16s;
        }
        .cta-browse:hover { background: #0f1a12; color: #33ff99; }
        .cta-arr { font-size: 11px; opacity: 0.6; transition: transform 0.14s, opacity 0.14s; }
        .cta-browse:hover .cta-arr { transform: translateX(3px); opacity: 1; }

        /* ── STATS ── */
        .stats-row {
          display: grid; grid-template-columns: repeat(4,1fr);
          border-top: 1px solid #111; border-bottom: 1px solid #111;
        }
        .stat-cell { padding: 22px 40px; border-right: 1px solid #111; }
        .stat-cell:last-child { border-right: none; }
        .stat-n { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:#ddd; line-height:1; }
        .stat-l { font-size:9px; color:#3a3a3a; letter-spacing:0.18em; text-transform:uppercase; margin-top:5px; }

        /* ── SECTIONS ── */
        .sec { max-width: 900px; margin: 76px auto 0; padding: 0 40px; }
        .sec-label {
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: #333;
          margin-bottom: 22px;
          display: flex; align-items: center; gap: 14px;
        }
        .sec-label::after { content:''; flex:1; height:1px; background:#111; }

        /* Features */
        .feat-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; background: #111;
          border: 1px solid #111; border-radius: 5px; overflow: hidden;
        }
        .feat-card { background: #070707; padding: 26px 22px; transition: background 0.18s; }
        .feat-card:hover { background: #0b0b0b; }
        .feat-icon { width:28px;height:28px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;margin-bottom:16px; }
        .feat-t { font-size:12px;font-weight:500;color:#bbb;margin-bottom:9px;letter-spacing:0.02em; }
        .feat-d { font-size:11px;color:#484848;line-height:1.8; }

        /* Phases */
        .ph-grid { display:grid;grid-template-columns:repeat(6,1fr);gap:5px; }
        .ph-chip { padding:9px 10px;border-radius:3px;border:1px solid #111;transition:background 0.14s; }
        .ph-chip:hover { background:#0c0c0c; }
        .ph-n { font-size:10px;font-weight:600;margin-bottom:3px; }
        .ph-name { font-size:9px;color:#3c3c3c; }

        /* Bottom CTA */
        .bcta { border-top:1px solid #111;margin-top:76px;padding:76px 40px;text-align:center; }
        .bcta-h {
          font-family:'Syne',sans-serif;
          font-size:clamp(24px,3.2vw,42px);font-weight:800;
          color:#e0e0e0;letter-spacing:-0.02em;margin-bottom:12px;
        }
        .bcta-s { font-size:11px;color:#333;letter-spacing:0.1em;margin-bottom:34px; }

        /* Footer */
        .land-foot { border-top:1px solid #0d0d0d;padding:18px 40px;display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#2a2a2a;letter-spacing:0.1em; }

        /* Animations */
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .a1{animation:fadeUp 0.5s 0.00s ease both}
        .a2{animation:fadeUp 0.5s 0.08s ease both}
        .a3{animation:fadeUp 0.5s 0.17s ease both}
        .a4{animation:fadeUp 0.5s 0.26s ease both}

        /* Responsive */
        @media(max-width:640px){
          .land-nav { padding:0 18px; }
          .nav-ghost,.nav-sep { display:none; }
          .hero { padding:60px 20px 52px; }
          .stats-row { grid-template-columns:repeat(2,1fr); }
          .stat-cell { padding:18px 20px; }
          .sec { padding:0 20px; }
          .feat-grid { grid-template-columns:1fr; }
          .ph-grid { grid-template-columns:repeat(3,1fr); }
          .bcta { padding:60px 20px; }
          .land-foot { flex-direction:column;gap:6px;text-align:center;padding:18px 20px; }
          .cta-group { width:100%; }
          .cta-start,.cta-browse { flex:1;justify-content:center; }
        }
      `}</style>

      <div className="land-root">

        {/* NAV */}
        <nav className="land-nav">
          <Link href="/" className="nav-logo">
            <div className="logo-dot" />
            DevRoad
          </Link>
          <div className="nav-right">
            <Link href="/roadmap" className="nav-roadmap">
              Browse roadmap
              <span className="nav-roadmap-arr">→</span>
            </Link>
            <div className="nav-sep" />
            <Link href="/login" className="nav-ghost">Sign in</Link>
            <Link href="/register" className="nav-cta">Get started</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow a1">
            <span className="eyebrow-line" />
            8-month backend mastery program
          </div>
          <h1 className="hero-title a2">
            <span className="title-dim">Stop being</span>
            <span className="title-main">tutorial-dependent.</span>
            <span className="title-grad">Go deep.</span>
          </h1>
          <p className="hero-body a3">
            A structured roadmap from CPU architecture to distributed systems.{" "}
            <em>600+ tasks, AI-generated assignments, notes per concept, streak tracking.</em>{" "}
            Built for devs who already ship but don&apos;t own what they&apos;ve built.
          </p>
          {/* Joined CTA group */}
          <div className="a4">
            <div className="cta-group">
              <Link href="/register" className="cta-start">Start the grind</Link>
              <Link href="/roadmap" className="cta-browse">
                Browse the roadmap
                <span className="cta-arr">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-row">
          {[
            { n: "22", l: "Phases" },
            { n: "600+", l: "Checklist items" },
            { n: "32", l: "Weeks" },
            { n: "∞", l: "AI Assignments" },
          ].map((s) => (
            <div key={s.l} className="stat-cell">
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div className="sec">
          <p className="sec-label">What&apos;s inside</p>
          <div className="feat-grid">
            {features.map((f) => (
              <div key={f.title} className="feat-card">
                <div className="feat-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <div className="feat-t">{f.title}</div>
                <div className="feat-d">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PHASES */}
        <div className="sec" style={{ marginTop: 72 }}>
          <p className="sec-label">The 22 phases</p>
          <div className="ph-grid">
            {phases.map((p) => (
              <div key={p.n} className="ph-chip" style={{ borderColor: p.color + "18" }}>
                <div className="ph-n" style={{ color: p.color }}>{p.n}</div>
                <div className="ph-name">{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <section className="bcta">
          <h2 className="bcta-h">Start today. Own it in 8 months.</h2>
          <p className="bcta-s">the discomfort you feel is the learning</p>
          <div className="cta-group">
            <Link href="/register" className="cta-start">Create free account</Link>
            <Link href="/roadmap" className="cta-browse">
              See the roadmap
              <span className="cta-arr">→</span>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="land-foot">
          <span>DEVROAD · 2026</span>
          <span>build → break → understand → repeat</span>
        </footer>

      </div>
    </>
  );
}