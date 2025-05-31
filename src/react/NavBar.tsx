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
  const [dark, setDarkState] = React.useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  React.useEffect(() => {
    document.documentElement.classList[dark ? "add" : "remove"]("dark");
  }, [dark]);

  return (
    <NavigationMenu className="w-screen max-w-screen">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink>Data</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex items-center space-x-2">
          <Switch
            defaultChecked={true}
            onClick={() => {
              setDarkState(!dark);
            }}
          />
          {dark ? <Moon /> : <Sun />}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
