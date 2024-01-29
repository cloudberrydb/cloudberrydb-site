import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import type { Props } from "@theme/BlogPostPaginator";

export default function BlogPostPaginator(props: Props): JSX.Element {
  const { nextItem, prevItem } = props;

  return (
    <nav
      className="pagination-nav"
      aria-label={translate({
        id: "theme.blog.post.paginator.navAriaLabel",
        message: "Blog post page navigation",
        description: "The ARIA label for the blog posts pagination",
      })}
    >
      {prevItem && (
        <PaginatorNavLink
          {...prevItem}
          subLabel={
            <Translate
              id="theme.blog.post.paginator.newerPost"
              description="The blog post button label to navigate to the newer/previous post"
            >
              Previous
            </Translate>
          }
        />
      )}
      {nextItem && (
        <PaginatorNavLink
          {...nextItem}
          subLabel={
            <Translate
              id="theme.blog.post.paginator.olderPost"
              description="The blog post button label to navigate to the older/next post"
            >
              Next
            </Translate>
          }
          isNext
        />
      )}
    </nav>
  );
}
