
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

    // Create color schemes with light background tones and consistent button colors
    const colors = {
      purple: {
        primary: "252, 86%, 75%", // Button color
        secondary: "260, 28%, 54%",
        accent: "252, 100%, 95%", // Light accent color
        muted: "248, 50%, 96%",
        background: "252, 100%, 99%", // Very light background
        hover: "252, 86%, 70%"
      },
      green: {
        primary: "142, 57%, 66%", // Button color
        secondary: "142, 27%, 55%",
        accent: "142, 76%, 95%", // Light accent color
        muted: "142, 38%, 95%",
        background: "142, 60%, 99%", // Very light background
        hover: "142, 57%, 60%"
      },
      peach: {
        primary: "22, 100%, 78%", // Button color
        secondary: "22, 100%, 70%",
        accent: "22, 100%, 95%", // Light accent color
        muted: "22, 100%, 97%",
        background: "22, 100%, 99%", // Very light background
        hover: "22, 100%, 72%"
      },
      blue: {
        primary: "212, 100%, 78%", // Button color
        secondary: "212, 88%, 72%",
        accent: "212, 100%, 95%", // Light accent color
        muted: "212, 100%, 97%",
        background: "212, 100%, 99%", // Very light background
        hover: "212, 100%, 72%"
      },
    };

    const selectedColors = colors[themeColor];
    
    // Set CSS custom properties with HSL values
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
