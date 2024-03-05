import { useState } from "react";
type ColorMode = "light" | "dark";

export function useMediaColor(): ColorMode {
  const [colorMode, setColorMode] = useState<ColorMode>();
  // 检测操作系统是否为夜间模式
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isDarkMode) {
    setColorMode("dark");
  } else {
    setColorMode("light");
  }
  return colorMode;
}
