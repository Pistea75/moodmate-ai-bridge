
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeColor = "indigo" | "green" | "orange" | "blue";

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

      // Create color schemes with better variants
      const colors = {
        indigo: {
          primary: "238, 75%, 65%", // Better indigo
          secondary: "243, 40%, 60%", 
          accent: "238, 50%, 97%",
          muted: "238, 25%, 96%",
          background: "238, 20%, 99%",
        },
        green: {
          primary: "142, 52%, 65%",
          secondary: "142, 30%, 60%",
          accent: "142, 40%, 97%",
          muted: "142, 25%, 96%",
          background: "142, 25%, 99%",
        },
        orange: {
          primary: "22, 80%, 72%",
          secondary: "22, 70%, 67%",
          accent: "22, 30%, 97%",
          muted: "22, 20%, 97%",
          background: "22, 15%, 99%",
        },
        blue: {
          primary: "212, 70%, 70%",
          secondary: "212, 60%, 65%",
          accent: "212, 30%, 97%",
          muted: "212, 20%, 97%",
          background: "212, 15%, 99%",
        },
      };

      const selectedColors = colors[themeColor];
      
      root.style.setProperty("--primary", selectedColors.primary);
      root.style.setProperty("--secondary", selectedColors.secondary);
      root.style.setProperty("--accent", selectedColors.accent);
      root.style.setProperty("--muted", selectedColors.muted);
      root.style.setProperty("--page-background", selectedColors.background);
    }
  }, [themeColor]);

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
