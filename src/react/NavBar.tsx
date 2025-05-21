import { Label } from "@/components/ui/label";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export default function NavBar() {
  const [theme, setThemeState] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "light");
  }, []);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  return (
    <NavigationMenu className="w-screen max-w-screen">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink>Data</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex items-center space-x-2">
          <Sun />
          <Switch
            onClick={() => {
              setThemeState(theme === "light" ? "light" : "dark");
            }}
          />
          <Moon />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
