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
        primary: "#9b87f5",
        secondary: "#7E69AB",
        accent: "#E5DEFF",
        muted: "#F1F0FB",
        background: "#F8F7FF",
        hover: "#8A75F2"
      },
      green: {
        primary: "#87C987",
        secondary: "#68B568",
        accent: "#F2FCE2",
        muted: "#E8F5E9",
        background: "#F7FDF2",
        hover: "#75C275"
      },
      peach: {
        primary: "#FFAB91",
        secondary: "#FF8A65",
        accent: "#FDE1D3",
        muted: "#FBE9E7",
        background: "#FFF8F5",
        hover: "#FF9B7B"
      },
      blue: {
        primary: "#91B8FF",
        secondary: "#7DA6F5",
        accent: "#D3E4FD",
        muted: "#E3F2FD",
        background: "#F5F9FF",
        hover: "#80ABFF"
      },
    };

    const selectedColors = colors[themeColor];
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
