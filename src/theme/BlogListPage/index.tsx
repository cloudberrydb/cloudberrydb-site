import { useLocation } from "@docusaurus/router";
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { Props } from "@theme/BlogListPage";
import BlogPostItems from "@theme/BlogPostItems";
import SearchMetadata from "@theme/SearchMetadata";
import clsx from "clsx";
import { useEffect, useState } from "react";
import BlogLayout from "../BlogLayout";

function BlogListPageMetadata(props: Props): JSX.Element {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const { items, sidebar } = props;
  const [renderItems, setRenderItem] = useState(items);
  const location = useLocation();
  useEffect(() => {
    const tagQuery = new URLSearchParams(location.search).get("tag");
    if (tagQuery === "All") {
      setRenderItem(items);
    } else if (tagQuery) {
      const rItem = items.filter((item) => {
        return item.content.metadata.tags.find(
          (item) => item.label === tagQuery
        );
      });
      setRenderItem(rItem);
    }
  }, [location]);

  return (
    <BlogLayout sidebar={sidebar} items={props.items}>
      <BlogPostItems items={renderItems} />
      {/* <BlogListPaginator metadata={metadata} /> */}
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
