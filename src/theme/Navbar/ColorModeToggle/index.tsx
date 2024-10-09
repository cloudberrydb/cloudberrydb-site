import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
import ColorModeToggle from "@theme/ColorModeToggle";
import type { Props } from "@theme/Navbar/ColorModeToggle";
import { useEffect } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export default function NavbarColorModeToggle({
  className,
}: Props): JSX.Element | null {
  const navbarStyle = useThemeConfig().navbar.style;
  const disabled = useThemeConfig().colorMode.disableSwitch;
  const { colorMode, setColorMode } = useColorMode();

  if (disabled) {
    return null;
  }

  // match the color mode to the system preference
  useEffect(() => {
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (theme) {
      setColorMode(theme);
    } else {
      if (isDarkMode) {
        setColorMode("dark");
      } else {
        setColorMode("light");
      }
    }
  }, []);

  return (
    <ColorModeToggle
      className={clsx(className, 'check-theme-switch')}
      buttonClassName={
        navbarStyle === "dark" ? styles.darkNavbarColorModeToggle : undefined
      }
      value={colorMode}
      onChange={setColorMode}
    />
  );
}
