export function useIsLightMode() {
  if (!globalThis.document?.documentElement) return "";
  return document.documentElement.getAttribute("data-theme") === "light";
}
export function useIsDarkMode() {
  if (!globalThis.document?.documentElement) return "";
  return document.documentElement.getAttribute("data-theme") === "dark";
}
