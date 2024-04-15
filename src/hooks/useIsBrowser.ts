export function useIsBrowser(): boolean {
  return typeof window !== "undefined";
}
