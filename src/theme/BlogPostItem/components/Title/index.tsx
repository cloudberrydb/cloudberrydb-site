import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/BlogPostItem/Header/Title";
import styles from "./styles.module.scss";

export default function BlogPostItemHeaderTitle({
  className,
}: Props): JSX.Element {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { title } = metadata;
  return (
    <div className={clsx(styles.title, className)} itemProp="headline">
      {isBlogPostPage ? (
        <span className={clsx(styles.detailTitle)}>{title}</span>
      ) : (
        <div className="two-lines-ellipsis">{title}</div>
      )}
    </div>
  );
}
