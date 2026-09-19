import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import PillNav from "./PillNav";

/* ── Dynamic NeuroAvatar SVG mark ── */
const getLogoSvg = (color: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
  <circle cx="18" cy="18" r="16.5" stroke="${color}" stroke-width="1.3" stroke-opacity="0.65"/>
  <circle cx="18" cy="18" r="11" stroke="${color}" stroke-width="0.8" stroke-opacity="0.35"/>
  <circle cx="18" cy="18" r="4.5" fill="${color}" opacity="0.95"/>
  <circle cx="18" cy="18" r="7.5" fill="${color}" opacity="0.18"/>
  <line x1="18" y1="2" x2="18" y2="7.5" stroke="${color}" stroke-width="1.3" stroke-opacity="0.6" stroke-linecap="round"/>
  <line x1="18" y1="28.5" x2="18" y2="34" stroke="${color}" stroke-width="1.3" stroke-opacity="0.6" stroke-linecap="round"/>
  <line x1="2" y1="18" x2="7.5" y2="18" stroke="${color}" stroke-width="1.3" stroke-opacity="0.6" stroke-linecap="round"/>
  <line x1="28.5" y1="18" x2="34" y2="18" stroke="${color}" stroke-width="1.3" stroke-opacity="0.6" stroke-linecap="round"/>
  <line x1="6.5" y1="6.5" x2="10" y2="10" stroke="${color}" stroke-width="0.9" stroke-opacity="0.4" stroke-linecap="round"/>
  <line x1="26" y1="26" x2="29.5" y2="29.5" stroke="${color}" stroke-width="0.9" stroke-opacity="0.4" stroke-linecap="round"/>
  <line x1="29.5" y1="6.5" x2="26" y2="10" stroke="${color}" stroke-width="0.9" stroke-opacity="0.4" stroke-linecap="round"/>
  <line x1="10" y1="26" x2="6.5" y2="29.5" stroke="${color}" stroke-width="0.9" stroke-opacity="0.4" stroke-linecap="round"/>
</svg>`)}`;

const NAV_ITEMS = [
  { label: "VISION",       href: "#vision" },
  { label: "TECHNOLOGY",   href: "#technology" },
  { label: "DEMO",         href: "#demo" },
  { label: "FUTURE SCOPE", href: "#future" },
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
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY < 140) {
        setActiveHref("");
      }
    };
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
        ([entry]) => {
          if (entry.isIntersecting) setActiveHref(`#${id}`);
        },
        { rootMargin: "-25% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  /* Theme-aware PillNav colours & luminous borders */
  const baseColor    = isDark ? "#080b11" : "#f5f0e6";
  const pillColor    = isDark ? "#121722" : "#e8e0d2";
  const hoverText    = isDark ? "#00e5ff" : "#b45309";
  const pillText     = isDark ? "#94a3b8" : "#1e293b";
  const navBorder    = isDark ? "rgba(0, 229, 255, 0.24)" : "rgba(180, 83, 9, 0.28)";
  const navShadow    = isDark
    ? "0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(0, 229, 255, 0.09)"
    : "0 8px 28px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(180, 83, 9, 0.08)";
  const activePillBg = isDark ? "rgba(0, 229, 255, 0.12)" : "rgba(180, 83, 9, 0.14)";
  const logoColor    = isDark ? "%2300e5ff" : "%23b45309";

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-5"
      }`}
      style={{
        background: scrolled
          ? isDark
            ? "hsl(215 28% 5% / 0.94)"
            : "hsl(36 28% 90% / 0.97)"
          : "transparent",
        backdropFilter: scrolled ? "blur(30px) saturate(1.7)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(30px) saturate(1.7)" : "none",
        borderBottom: scrolled
          ? isDark
            ? "1px solid rgba(0, 229, 255, 0.15)"
            : "1px solid rgba(180, 83, 9, 0.18)"
          : "1px solid transparent",
      }}
    >
      {/* Centering wrapper */}
      <div className="w-full flex items-center justify-center px-4 sm:px-6 relative">
        {/* Centered pill nav with neurologo.png */}
        <PillNav
          logo="/neurologo.png"
          logoAlt="NeuroAvatar"
          items={NAV_ITEMS}
          activeHref={activeHref}
          ease="power3.easeOut"
          baseColor={baseColor}
          pillColor={pillColor}
          hoveredPillTextColor={hoverText}
          pillTextColor={pillText}
          navBorder={navBorder}
          navShadow={navShadow}
          activePillBg={activePillBg}
          initialLoadAnimation={true}
        />

        {/* Right controls — absolutely positioned */}
        <div className="flex items-center gap-3 flex-shrink-0 absolute right-4 sm:right-6">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden"
            style={{
              borderColor: isDark ? "hsl(38 90% 52% / 0.45)" : "hsl(38 85% 36% / 0.5)",
              background: isDark ? "hsl(215 28% 9% / 0.94)" : "hsl(38 32% 96% / 0.96)",
              boxShadow: isDark
                ? "0 0 18px hsl(38 90% 52% / 0.2), inset 0 0 8px hsl(38 90% 52% / 0.1)"
                : "0 2px 12px rgba(0,0,0,0.1), inset 0 0 6px hsl(38 85% 50% / 0.12)",
            }}
            title={isDark ? "Switch to Warm Light Theme" : "Switch to Cyber Dark Theme"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(38 95% 58%)"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="transition-transform duration-500 group-hover:rotate-45"
              >
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(38 90% 28%)"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="transition-transform duration-500 group-hover:-rotate-12"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* CTA */}
          <button
            onClick={() => scrollTo("#invest")}
            className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-full text-[11.5px] font-black tracking-[0.2em] uppercase transition-all duration-300 border shadow-md hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              borderColor: isDark ? "hsl(38 90% 52% / 0.55)" : "hsl(38 90% 36% / 0.7)",
              color: isDark ? "hsl(38 95% 66%)" : "hsl(38 95% 22%)",
              background: isDark ? "hsl(38 90% 52% / 0.12)" : "hsl(38 90% 44% / 0.15)",
              boxShadow: isDark
                ? "0 0 18px hsl(38 90% 52% / 0.18)"
                : "0 4px 12px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark
                ? "hsl(38 90% 52% / 0.25)"
                : "hsl(38 90% 44% / 0.25)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isDark
                ? "0 0 28px hsl(38 90% 52% / 0.4)"
                : "0 6px 18px hsl(38 90% 40% / 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark
                ? "hsl(38 90% 52% / 0.12)"
                : "hsl(38 90% 44% / 0.15)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isDark
                ? "0 0 18px hsl(38 90% 52% / 0.18)"
                : "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            REQUEST DECK
          </button>
        </div>
      </div>
    </header>
  );
}
