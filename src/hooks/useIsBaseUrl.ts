import { useLocation } from "@docusaurus/router";
export default function useIsBaseUrl() {
  const location = useLocation();
  return location.pathname === "/" || location.pathname === "/zh/";
}
