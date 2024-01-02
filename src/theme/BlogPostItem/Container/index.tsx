import React from "react";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/BlogPostItem/Container";
export default function BlogPostItemContainer({
  children,
  className,
}: Props): JSX.Element {
  const { isBlogPostPage } = useBlogPost();
  return (
    <article
      style={{
        width: isBlogPostPage ? "auto" : 440,
        height: isBlogPostPage ? "auto" : 383,
      }}
      className={className}
      itemProp="blogPost"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {children}
    </article>
  );
}
