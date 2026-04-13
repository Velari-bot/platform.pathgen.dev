"use client";

import Link from "next/link";
import { CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";

/* ── Tiny Win2k window chrome component ─────────────────── */
function Win2kWindow({
  title,
  children,
  className = "",
  icon,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`win-window ${className}`} style={{ fontFamily: "Verdana, Tahoma, Arial, sans-serif" }}>
      {/* Title bar */}
      <div className="win-titlebar" style={{ gap: 6 }}>
        {icon && <span style={{ marginRight: 4 }}>{icon}</span>}
        <span className="flex-1" style={{ fontSize: 11 }}>{title}</span>
        {/* Window control buttons */}
        <div style={{ display: "flex", gap: 2, marginLeft: 4 }}>
          {["_", "□", "×"].map((btn, i) => (
            <span
              key={i}
              className="win-raised"
              style={{
                width: 16,
                height: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: "bold",
                cursor: "pointer",
                color: "#000",
                flexShrink: 0,
              }}
            >
              {btn}
            </span>
          ))}
        </div>
      </div>
      {/* Content area */}
      <div style={{ padding: 8 }}>{children}</div>
    </div>
  );
}

/* ── Retro icon blobs ─────────────────────────────────────── */
function PixelIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="win-sunken"
      style={{
        display: "inline-flex",
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
        fontSize: 18,
      }}
    >
      {children}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="win-desktop" style={{ minHeight: "100vh" }}>

      {/* ── Marquee announcement bar ───────────────────────── */}
      <div className="win-marquee-bar">
        <span className="win-scroll">
          ★ WELCOME TO PATHGEN.DEV — PROFESSIONAL FORTNITE DATA INFRASTRUCTURE ★&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          NEW: WASM REPLAY PARSER v2.4 NOW AVAILABLE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ★ 10,000 FREE CREDITS FOR NEW USERS — SIGN UP TODAY ★&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          BEST VIEWED IN INTERNET EXPLORER 5.0 AT 800×600 RESOLUTION
        </span>
      </div>

      {/* ── Desktop area – full window layout ──────────────── */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── MAIN WINDOW ─────────────────────────────────── */}
        <Win2kWindow
          title="PathGen Developer Platform - Microsoft Internet Explorer"
          icon={<span style={{ fontSize: 12 }}>🌐</span>}
        >
          {/* IE toolbar simulation */}
          <div
            className="win-raised"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 4px",
              marginBottom: 6,
              fontSize: 11,
            }}
          >
            {["◀ Back", "▶ Forward", "✕ Stop", "↻ Refresh", "🏠 Home"].map((btn) => (
              <button key={btn} className="win-btn" style={{ padding: "2px 8px", minWidth: "auto", fontSize: 10 }}>
                {btn}
              </button>
            ))}
            <span style={{ marginLeft: 8, fontSize: 10, color: "#444" }}>Address:</span>
            <div
              className="win-sunken"
              style={{ flex: 1, padding: "1px 6px", fontSize: 10, color: "#0000ee" }}
            >
              https://platform.pathgen.dev/
            </div>
            <button className="win-btn" style={{ padding: "2px 10px", fontSize: 10 }}>
              Go
            </button>
          </div>

          {/* Page header / hero */}
          <div
            style={{
              background: "linear-gradient(180deg, #000080 0%, #1084d0 100%)",
              padding: "20px 24px",
              textAlign: "center",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: "bold", letterSpacing: 3, color: "#ffff00", marginBottom: 6 }}>
              ★ NEXT-GENERATION FORTNITE DATA INFRASTRUCTURE ★
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: "bold",
                fontFamily: "Impact, Arial Black, sans-serif",
                letterSpacing: 2,
                textShadow: "2px 2px 0px #000040",
                lineHeight: 1.1,
              }}
            >
              PathGen<span style={{ color: "#ffff00" }}>.</span>dev
            </div>
            <div style={{ fontSize: 12, marginTop: 8, color: "#c8e4ff" }}>
              Build the Future of Competitive Fortnite
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              <Link href="/signup" className="win-btn-primary" style={{ padding: "6px 24px", fontSize: 12, fontWeight: "bold" }}>
                ✓ Get Started FREE
              </Link>
              <Link href="/docs" className="win-btn" style={{ padding: "6px 20px", fontSize: 12 }}>
                📄 View Documentation
              </Link>
            </div>

            {/* Fake status readout */}
            <div
              className="win-sunken"
              style={{
                display: "inline-block",
                marginTop: 16,
                padding: "4px 16px",
                background: "#000",
                color: "#00ff00",
                fontFamily: "Courier New, monospace",
                fontSize: 11,
              }}
            >
              <span>TELEMETRY_STREAM: </span>
              <span style={{ color: "#ffff00" }}>CONNECTED</span>
              <span className="win-blink" style={{ color: "#00ff00" }}> ▌</span>
              &nbsp;&nbsp;SESSION_ID: rs_35402b9d...
            </div>
          </div>

          {/* ── FEATURES SECTION ─────────────────────────── */}
          <div className="win-groupbox" style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 10,
                borderBottom: "1px solid #808080",
                paddingBottom: 4,
                color: "#000080",
              }}
            >
              ⚙ Powerful Features
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast Parsing",
                  desc: "Extract every detail from Fortnite replays in milliseconds using our optimized WASM parser.",
                  badge: "NEW!",
                },
                {
                  icon: "🔒",
                  title: "Bank-Grade Security",
                  desc: "Secure API key management and encrypted data transmission keep your data safe.",
                  badge: "",
                },
                {
                  icon: "📊",
                  title: "Deep Analytics",
                  desc: "Get insights on player movement, build patterns, and combat efficiency out of the box.",
                  badge: "HOT",
                },
              ].map((f) => (
                <div key={f.title} className="win-raised" style={{ padding: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <PixelIcon>{f.icon}</PixelIcon>
                    {f.badge && (
                      <span
                        style={{
                          background: "#ff0000",
                          color: "#fff",
                          fontSize: 9,
                          fontWeight: "bold",
                          padding: "1px 5px",
                        }}
                      >
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: 11, marginBottom: 4, color: "#000080" }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#333", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PRICING SECTION ──────────────────────────── */}
          <div className="win-groupbox" style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 10,
                borderBottom: "1px solid #808080",
                paddingBottom: 4,
                color: "#000080",
              }}
            >
              💰 Credit Pack Pricing — No Monthly Fees!
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
              {[
                {
                  name: "Starter Pack",
                  credits: "10,000",
                  price: "$10",
                  features: ["Full API Access", "Standard Parsing", "Community Support"],
                  popular: false,
                  color: "#d4d0c8",
                },
                {
                  name: "Pro Pack",
                  credits: "60,000",
                  price: "$50",
                  features: ["10k Bonus Credits", "Priority Processing", "Email Support"],
                  popular: true,
                  color: "#e8f4ff",
                },
                {
                  name: "Elite Pack",
                  credits: "150,000",
                  price: "$100",
                  features: ["50k Bonus Credits", "Dedicated Infrastructure", "Developer Support"],
                  popular: false,
                  color: "#d4d0c8",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="win-raised"
                  style={{
                    padding: 10,
                    background: p.popular ? "#e8f4ff" : "#d4d0c8",
                    position: "relative",
                  }}
                >
                  {p.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#ff8800",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: "bold",
                        padding: "2px 8px",
                      }}
                    >
                      ★ MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontWeight: "bold", fontSize: 12, color: "#000080", marginBottom: 4, marginTop: p.popular ? 14 : 0 }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      fontFamily: "Impact, sans-serif",
                      color: "#000080",
                      lineHeight: 1,
                    }}
                  >
                    {p.price}
                  </div>
                  <div style={{ fontSize: 10, color: "#008000", fontWeight: "bold", marginBottom: 8 }}>
                    {p.credits} Credits
                  </div>
                  <div className="win-divider" style={{ marginBottom: 8 }} />
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px 0" }}>
                    {p.features.map((f) => (
                      <li key={f} style={{ fontSize: 10, color: "#333", marginBottom: 3 }}>
                        <span style={{ color: "#008000", fontWeight: "bold" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="win-btn"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "4px 8px",
                      fontSize: 10,
                      fontWeight: "bold",
                      background: p.popular ? "#000080" : "#d4d0c8",
                      color: p.popular ? "#ffffff" : "#000000",
                      border: p.popular
                        ? "2px outset #4040ff"
                        : undefined,
                    }}
                  >
                    Purchase Pack →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA SECTION ──────────────────────────────── */}
          <div
            className="win-sunken"
            style={{
              padding: 16,
              textAlign: "center",
              background: "#000080",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Impact, Arial Black, sans-serif",
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              🚀 Ready to Start Building?
            </div>
            <Link
              href="/signup"
              className="win-btn-primary"
              style={{ padding: "8px 32px", fontSize: 13, fontWeight: "bold", letterSpacing: 1 }}
            >
              ★ JOIN PATHGEN PLATFORM ★
            </Link>
          </div>

          {/* ── Status bar ───────────────────────────────── */}
          <div className="win-statusbar" style={{ marginTop: 4 }}>
            <span>✅ Done</span>
            <span style={{ borderLeft: "1px solid #808080", borderRight: "1px solid #fff", padding: "0 8px" }}>
              🌐 Internet
            </span>
            <span>© 2026 PathGen.dev — Built for the Fortnite Developer Community</span>
          </div>
        </Win2kWindow>

        {/* ── Taskbar ───────────────────────────────────── */}
        <div
          className="win-raised"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "2px 6px",
            minHeight: 28,
          }}
        >
          <button
            className="win-raised"
            style={{
              padding: "2px 10px",
              fontWeight: "bold",
              fontSize: 11,
              background: "linear-gradient(180deg, #1084d0, #000080)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 14 }}>⊞</span> Start
          </button>
          <div className="win-divider" style={{ width: 1, height: 20, borderTop: "none", borderLeft: "1px solid #808080", borderRight: "1px solid #fff", borderBottom: "none" }} />
          <button
            className="win-sunken"
            style={{ padding: "2px 10px", fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}
          >
            🌐 PathGen Platform
          </button>
          <div style={{ flex: 1 }} />
          <div
            className="win-sunken"
            style={{ padding: "2px 8px", fontSize: 10, fontFamily: "Courier New, monospace" }}
          >
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

      </div>
    </div>
  );
}
