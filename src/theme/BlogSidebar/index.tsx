// npm run swizzle @docusaurus/theme-classic BlogSidebar -- --typescript
import React from "react";
import { useWindowSize } from "@docusaurus/theme-common";
import BlogSidebarDesktop from "./Desktop";
import BlogSidebarMobile from "./Mobile";
import type { Props } from "@theme/BlogSidebar";

export default function BlogSidebar({
  sidebar,
  items,
}: Props & { items: any }): JSX.Element | null {
  const windowSize = useWindowSize();
  if (!sidebar?.items.length) {
    return null;
  }
  // Mobile sidebar doesn't need to be server-rendered
  if (windowSize === "mobile") {
    return <BlogSidebarMobile sidebar={sidebar} />;
  }
  return <BlogSidebarDesktop items={items} />;
}
