
import React, { createContext, useContext, useEffect, useState } from "react";

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

    // Create color schemes with lighter, more subtle tones
    const colors = {
      purple: {
        primary: "252, 76%, 65%", // Lighter purple
        secondary: "260, 28%, 60%", 
        accent: "252, 60%, 97%", // Very light accent for backgrounds
        muted: "248, 30%, 96%",
        background: "252, 30%, 99%", // Very light background
      },
      green: {
        primary: "142, 52%, 65%", // Lighter green
        secondary: "142, 30%, 60%",
        accent: "142, 40%, 97%", // Very light accent
        muted: "142, 25%, 96%",
        background: "142, 25%, 99%", // Very light background
      },
      peach: {
        primary: "22, 80%, 72%", // Lighter peach
        secondary: "22, 70%, 67%",
        accent: "22, 30%, 97%", // Very light accent
        muted: "22, 20%, 97%",
        background: "22, 15%, 99%", // Very light background
      },
      blue: {
        primary: "212, 70%, 70%", // Lighter blue
        secondary: "212, 60%, 65%",
        accent: "212, 30%, 97%", // Very light accent
        muted: "212, 20%, 97%",
        background: "212, 15%, 99%", // Very light background
      },
    };

    const selectedColors = colors[themeColor];
    
    // Set CSS custom properties with HSL values
    root.style.setProperty("--primary", selectedColors.primary);
    root.style.setProperty("--secondary", selectedColors.secondary);
    root.style.setProperty("--accent", selectedColors.accent);
    root.style.setProperty("--muted", selectedColors.muted);
    root.style.setProperty("--page-background", selectedColors.background);
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
