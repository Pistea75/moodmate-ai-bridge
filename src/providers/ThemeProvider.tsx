
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

    // Update CSS variables based on theme color
    const colors = {
      purple: {
        primary: "#9b87f5",
        secondary: "#7E69AB",
        accent: "#E5DEFF",
        muted: "#F1F0FB",
        foreground: "#1A1F2C"
      },
      green: {
        primary: "#4CAF50",
        secondary: "#388E3C",
        accent: "#F2FCE2",
        muted: "#E8F5E9",
        foreground: "#1B5E20"
      },
      peach: {
        primary: "#FFAB91",
        secondary: "#FF8A65",
        accent: "#FDE1D3",
        muted: "#FBE9E7",
        foreground: "#BF360C"
      },
      blue: {
        primary: "#64B5F6",
        secondary: "#42A5F5",
        accent: "#D3E4FD",
        muted: "#E3F2FD",
        foreground: "#0D47A1"
      },
    };

    root.style.setProperty("--mood-primary", colors[themeColor].primary);
    root.style.setProperty("--mood-secondary", colors[themeColor].secondary);
    root.style.setProperty("--mood-accent", colors[themeColor].accent);
    root.style.setProperty("--mood-muted", colors[themeColor].muted);
    root.style.setProperty("--mood-foreground", colors[themeColor].foreground);
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
