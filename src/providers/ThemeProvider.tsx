
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeColor = "purple" | "green" | "peach" | "blue";

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  themeColor: "purple",
  setTheme: () => null,
  setThemeColor: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage?.getItem("theme") as Theme) || "light"
  );
  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage?.getItem("themeColor") as ThemeColor) || "purple"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage?.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.dataset.themeColor = themeColor;
    localStorage?.setItem("themeColor", themeColor);

    const colors = {
      purple: {
        primary: "hsl(252, 86%, 75%)",
        secondary: "hsl(260, 28%, 54%)",
        accent: "hsl(252, 100%, 95%)",
        muted: "hsl(248, 50%, 96%)",
        background: "hsl(252, 100%, 99%)",
        hover: "hsl(252, 86%, 70%)"
      },
      green: {
        primary: "hsl(142, 57%, 66%)",
        secondary: "hsl(142, 27%, 55%)",
        accent: "hsl(142, 76%, 95%)",
        muted: "hsl(142, 38%, 95%)",
        background: "hsl(142, 60%, 99%)",
        hover: "hsl(142, 57%, 60%)"
      },
      peach: {
        primary: "hsl(22, 100%, 78%)",
        secondary: "hsl(22, 100%, 70%)",
        accent: "hsl(22, 100%, 95%)",
        muted: "hsl(22, 100%, 97%)",
        background: "hsl(22, 100%, 99%)",
        hover: "hsl(22, 100%, 72%)"
      },
      blue: {
        primary: "hsl(212, 100%, 78%)",
        secondary: "hsl(212, 88%, 72%)",
        accent: "hsl(212, 100%, 95%)",
        muted: "hsl(212, 100%, 97%)",
        background: "hsl(212, 100%, 99%)",
        hover: "hsl(212, 100%, 72%)"
      },
    };

    const selectedColors = colors[themeColor];
    
    // Set CSS custom properties as HSL values for Tailwind to use
    root.style.setProperty("--primary", selectedColors.primary);
    root.style.setProperty("--secondary", selectedColors.secondary);
    root.style.setProperty("--accent", selectedColors.accent);
    root.style.setProperty("--muted", selectedColors.muted);
    root.style.setProperty("--page-background", selectedColors.background);
    root.style.setProperty("--hover", selectedColors.hover);
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
