import { ColorMode, useColorMode } from "@docusaurus/theme-common";
export function useIsLightMode() {
  return useColorMode().colorMode === "light";
}
export function useIsDarkMode() {
  return useColorMode().colorMode === "dark";
}
export function useSetColorMode(colorMode: ColorMode) {
  useColorMode().setColorMode(colorMode);
}
