import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import PillNav from "./PillNav";

/* ── NeuroAvatar mark as data URI ── */
/* Amber ember mark */
const LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
  <circle cx="18" cy="18" r="16.5" stroke="%23d97706" stroke-width="1.2" stroke-opacity="0.5"/>
  <circle cx="18" cy="18" r="11" stroke="%23d97706" stroke-width="0.7" stroke-opacity="0.2"/>
  <circle cx="18" cy="18" r="4" fill="%23d97706" opacity="0.95"/>
  <circle cx="18" cy="18" r="7" fill="%23d97706" opacity="0.1"/>
  <line x1="18" y1="2" x2="18" y2="7.5" stroke="%23d97706" stroke-width="1.1" stroke-opacity="0.45" stroke-linecap="round"/>
  <line x1="18" y1="28.5" x2="18" y2="34" stroke="%23d97706" stroke-width="1.1" stroke-opacity="0.45" stroke-linecap="round"/>
  <line x1="2" y1="18" x2="7.5" y2="18" stroke="%23d97706" stroke-width="1.1" stroke-opacity="0.45" stroke-linecap="round"/>
  <line x1="28.5" y1="18" x2="34" y2="18" stroke="%23d97706" stroke-width="1.1" stroke-opacity="0.45" stroke-linecap="round"/>
  <line x1="6.5" y1="6.5" x2="10" y2="10" stroke="%23d97706" stroke-width="0.8" stroke-opacity="0.25" stroke-linecap="round"/>
  <line x1="26" y1="26" x2="29.5" y2="29.5" stroke="%23d97706" stroke-width="0.8" stroke-opacity="0.25" stroke-linecap="round"/>
  <line x1="29.5" y1="6.5" x2="26" y2="10" stroke="%23d97706" stroke-width="0.8" stroke-opacity="0.25" stroke-linecap="round"/>
  <line x1="10" y1="26" x2="6.5" y2="29.5" stroke="%23d97706" stroke-width="0.8" stroke-opacity="0.25" stroke-linecap="round"/>
</svg>`)}`;

const NAV_ITEMS = [
  { label: "VISION",       href: "#vision" },
  { label: "TECHNOLOGY",   href: "#technology" },
  { label: "DEMO",         href: "#demo" },
  { label: "ROADMAP",      href: "#roadmap" },
  { label: "APPLICATIONS", href: "#applications" },
  { label: "RESEARCH",     href: "#research" },
  { label: "INVEST",       href: "#invest" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  /* Glass-on-scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section tracking */
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((i) => i.href.replace("#", ""));
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHref(`#${id}`); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  /* Theme-aware PillNav colours — Obsidian + Ember */
  const baseColor  = isDark ? "#0b0d11" : "#f5f0e8";
  const pillColor  = isDark ? "#171a20" : "#ede7da";
  const hoverText  = isDark ? "#d97706" : "#92400e";
  const pillText   = isDark ? "#6b7280" : "#6b5a40";

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
      style={{
        background: scrolled
          ? isDark
            ? "hsl(215 28% 5% / 0.88)"
            : "hsl(38 22% 96% / 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? `1px solid hsl(var(--border) / 0.4)`
          : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* ── PillNav ── */}
        <PillNav
          logo={LOGO_SVG}
          logoAlt="NeuroAvatar"
          items={NAV_ITEMS}
          activeHref={activeHref}
          ease="power3.easeOut"
          baseColor={baseColor}
          pillColor={pillColor}
          hoveredPillTextColor={hoverText}
          pillTextColor={pillText}
          initialLoadAnimation={true}
        />

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: isDark ? "hsl(215 18% 18%)" : "hsl(38 15% 72%)",
              background: isDark ? "hsl(215 25% 9% / 0.8)" : "hsl(38 22% 99% / 0.8)",
            }}
            title={isDark ? "Switch to Light" : "Switch to Dark"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              /* Sun icon (switch to light) */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(38 90% 58%)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="5"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
                <line x1="2" y1="12" x2="5" y2="12"/>
                <line x1="19" y1="12" x2="22" y2="12"/>
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon (switch to dark) */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="hsl(215 28% 22%)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* CTA — hidden on small screens */}
          <button
            onClick={() => scrollTo("#invest")}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 border"
            style={{
              fontFamily: "'Space Grotesk', monospace",
              borderColor: isDark ? "hsl(38 90% 52% / 0.35)" : "hsl(38 90% 40% / 0.4)",
              color: isDark ? "hsl(38 90% 58%)" : "hsl(38 90% 32%)",
              background: isDark ? "hsl(38 90% 52% / 0.06)" : "hsl(38 90% 44% / 0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark
                ? "hsl(38 90% 52% / 0.14)"
                : "hsl(38 90% 44% / 0.12)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px hsl(38 90% 52% / 0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark
                ? "hsl(38 90% 52% / 0.06)"
                : "hsl(38 90% 44% / 0.06)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            REQUEST DECK
          </button>
        </div>
      </div>
    </header>
  );
}
