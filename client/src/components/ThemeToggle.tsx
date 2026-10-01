import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();
  if (!switchable || !toggleTheme) return null;

  const isDark = theme === "dark";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className="relative z-10 h-9 w-9 border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </Button>
  );
}
