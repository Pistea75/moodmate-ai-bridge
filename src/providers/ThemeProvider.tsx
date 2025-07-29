
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeColor = "indigo" | "green" | "orange" | "blue" | "purple" | "emerald";

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  themeColor: "indigo",
  setTheme: () => null,
  setThemeColor: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });
  
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return (localStorage.getItem("themeColor") as ThemeColor) || "indigo";
    }
    return "indigo";
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.dataset.themeColor = themeColor;
      localStorage.setItem("themeColor", themeColor);

      // Define color schemes with proper HSL values that match index.css structure
      const colorSchemes = {
        indigo: {
          primary: "263 83% 75%",
          secondary: "261 28% 63%",
          accent: "245 12% 95%",
          muted: "245 12% 95%",
          sidebarPrimary: "263 83% 75%",
          sidebarBackground: theme === "dark" ? "240 10% 8%" : "240 10% 15%",
          sidebarAccent: theme === "dark" ? "240 6% 15%" : "240 6% 20%",
        },
        green: {
          primary: "142 76% 36%",
          secondary: "142 69% 58%",
          accent: "142 76% 96%",
          muted: "142 76% 96%",
          sidebarPrimary: "142 76% 36%",
          sidebarBackground: theme === "dark" ? "142 84% 2%" : "142 84% 7%",
          sidebarAccent: theme === "dark" ? "142 84% 7%" : "142 84% 12%",
        },
        orange: {
          primary: "25 95% 53%",
          secondary: "25 95% 70%",
          accent: "25 95% 96%",
          muted: "25 95% 96%",
          sidebarPrimary: "25 95% 53%",
          sidebarBackground: theme === "dark" ? "25 95% 3%" : "25 95% 8%",
          sidebarAccent: theme === "dark" ? "25 95% 8%" : "25 95% 13%",
        },
        blue: {
          primary: "221 83% 53%",
          secondary: "221 83% 70%",
          accent: "221 83% 96%",
          muted: "221 83% 96%",
          sidebarPrimary: "221 83% 53%",
          sidebarBackground: theme === "dark" ? "221 83% 3%" : "221 83% 8%",
          sidebarAccent: theme === "dark" ? "221 83% 8%" : "221 83% 13%",
        },
        purple: {
          primary: "262 83% 58%",
          secondary: "262 83% 75%",
          accent: "262 83% 96%",
          muted: "262 83% 96%",
          sidebarPrimary: "262 83% 58%",
          sidebarBackground: theme === "dark" ? "262 83% 3%" : "262 83% 8%",
          sidebarAccent: theme === "dark" ? "262 83% 8%" : "262 83% 13%",
        },
        emerald: {
          primary: "160 84% 39%",
          secondary: "160 84% 56%",
          accent: "160 84% 96%",
          muted: "160 84% 96%",
          sidebarPrimary: "160 84% 39%",
          sidebarBackground: theme === "dark" ? "160 84% 3%" : "160 84% 8%",
          sidebarAccent: theme === "dark" ? "160 84% 8%" : "160 84% 13%",
        },
      };

      const selectedColors = colorSchemes[themeColor];
      
      if (selectedColors) {
        root.style.setProperty("--primary", selectedColors.primary);
        root.style.setProperty("--secondary", selectedColors.secondary);
        root.style.setProperty("--accent", selectedColors.accent);
        root.style.setProperty("--muted", selectedColors.muted);
        root.style.setProperty("--sidebar-primary", selectedColors.sidebarPrimary);
        root.style.setProperty("--sidebar-background", selectedColors.sidebarBackground);
        root.style.setProperty("--sidebar-accent", selectedColors.sidebarAccent);
        root.style.setProperty("--ring", selectedColors.primary);
      }
    }
  }, [themeColor, theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeColor, setTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
