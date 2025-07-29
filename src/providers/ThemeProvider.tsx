
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

      // Define color schemes with proper HSL values
      const colorSchemes = {
        indigo: {
          primary: "263 83% 58%",
          secondary: "261 28% 63%",
          accent: "245 12% 95%",
          muted: "245 12% 95%",
          ring: "263 83% 58%",
        },
        green: {
          primary: "142 76% 36%",
          secondary: "142 69% 58%",
          accent: "142 76% 96%",
          muted: "142 76% 96%",
          ring: "142 76% 36%",
        },
        orange: {
          primary: "25 95% 53%",
          secondary: "25 95% 70%",
          accent: "25 95% 96%",
          muted: "25 95% 96%",
          ring: "25 95% 53%",
        },
        blue: {
          primary: "221 83% 53%",
          secondary: "221 83% 70%",
          accent: "221 83% 96%",
          muted: "221 83% 96%",
          ring: "221 83% 53%",
        },
        purple: {
          primary: "262 83% 58%",
          secondary: "262 83% 75%",
          accent: "262 83% 96%",
          muted: "262 83% 96%",
          ring: "262 83% 58%",
        },
        emerald: {
          primary: "160 84% 39%",
          secondary: "160 84% 56%",
          accent: "160 84% 96%",
          muted: "160 84% 96%",
          ring: "160 84% 39%",
        },
      };

      const selectedColors = colorSchemes[themeColor];
      
      if (selectedColors) {
        root.style.setProperty("--primary", selectedColors.primary);
        root.style.setProperty("--secondary", selectedColors.secondary);
        root.style.setProperty("--accent", selectedColors.accent);
        root.style.setProperty("--muted", selectedColors.muted);
        root.style.setProperty("--ring", selectedColors.ring);
        
        // Update sidebar colors based on theme and selected color
        const sidebarBg = theme === "dark" ? "240 10% 8%" : "240 10% 15%";
        const sidebarAccent = theme === "dark" ? "240 6% 15%" : "240 6% 20%";
        
        root.style.setProperty("--sidebar-primary", selectedColors.primary);
        root.style.setProperty("--sidebar-background", sidebarBg);
        root.style.setProperty("--sidebar-accent", sidebarAccent);
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
