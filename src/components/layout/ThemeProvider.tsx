import { useState, useEffect, ReactNode } from "react";
import { ThemeContext, Theme } from "@/hooks/useTheme";

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark-theme");
    html.classList.remove("light-theme");
    html.style.backgroundColor = "hsl(215, 28%, 5%)";
    html.style.color = "hsl(38, 18%, 92%)";
    document.body.style.backgroundColor = "hsl(215, 28%, 5%)";
    document.body.style.color = "hsl(38, 18%, 92%)";
  } else {
    html.classList.add("light-theme");
    html.classList.remove("dark-theme");
    html.style.backgroundColor = "hsl(0, 0%, 100%)";
    html.style.color = "hsl(215, 35%, 12%)";
    document.body.style.backgroundColor = "hsl(0, 0%, 100%)";
    document.body.style.color = "hsl(215, 35%, 12%)";
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("na-theme") as Theme) || "dark";
    }
    return "dark";
  });

  // Apply on mount immediately
  useEffect(() => {
    applyTheme(theme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("na-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
