import React, { useState } from "react";
import clsx from "clsx";
import type { Content } from "@theme/BlogPostPage";

import styles from "./styles.module.scss";
import { useHistory, useLocation } from "@docusaurus/router";
export default function BlogSidebarDesktop(props: {
  items: { content: Content }[];
}): JSX.Element {
  const location = useLocation();
  const searchTag = new URLSearchParams(location.search).get("tag");

  const tags = (props.items || [])
    .map((item) => {
      return item.content.metadata.tags.map((tag) => {
        return tag.label;
      });
    })
    .flat(1);

  // Deduplication
  const deTags = tags.filter((item, index) => {
    return tags.indexOf(item) === index;
  });

  deTags.unshift("All");

  const [tag, setTag] = useState(searchTag || deTags[0]);

  const history = useHistory();
  const handleClick = (item) => {
    setTag(item);
    // sets query
    history.push({ search: `?tag=${item}` });
  };
  return (
    <aside className={styles.aside}>
      <nav className={clsx(styles.sidebar, "thin-scrollbar")}>
        <div className={clsx(styles.sidebarItemTitle)}>Blog categories</div>
        <ul className={clsx(styles.sidebarItemList, "clean-list")}>
          {deTags.map((item) => (
            <li
              key={item}
              className={clsx(styles.sidebarItem, {
                [styles.active]: tag === item,
              })}
              onClick={() => handleClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
