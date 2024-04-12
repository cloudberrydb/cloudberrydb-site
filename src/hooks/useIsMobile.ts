import { useSize } from "ahooks";
import { useRef } from "react";
import { useIsBrowser } from "./useIsBrowser";
export function useIsMobile(): boolean {
  if (!useIsBrowser()) return false;
  const { width } = useSize(useRef(document.body));
  return width <= 1024;
}

export function useIs1440Size() {
  if (!useIsBrowser()) return false;
  const { width } = useSize(useRef(document.body));
  return width <= 1440;
}

export function useIs768Size() {
  if (!useIsBrowser()) return false;
  const { width } = useSize(useRef(document.body));
  return width <= 768;
}
