import { useLocation } from "@docusaurus/router";
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ColorCard from "@site/src/components/common/ColorCard";
import ColorCardStyle from "@site/src/components/common/ColorCard/styles.module.scss";
import CommonLayout from "@site/src/components/common/Layout";
import MDXContent from "@theme/MDXContent";
import type { Props } from "@theme/MDXPage";
import TOC from "@theme/TOC";
import Unlisted from "@theme/Unlisted";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function MDXPage(props: Props): JSX.Element {
  const { content: MDXPageContent } = props;
  const location = useLocation();
  const pathLen = location.pathname.split("/").filter((item) => {
    return item != "" && item != "zh";
  }).length;

  const {
    metadata: { frontMatter, unlisted, description, title },
    assets,
  } = MDXPageContent;
  const { wrapperClassName, hide_table_of_contents: hideTableOfContents } =
    frontMatter;

  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage
      )}
    >
      <CommonLayout>
        <ColorCard
          className={clsx({
            [ColorCardStyle.mdxCard]: pathLen == 2,
          })}
          subText={description}
          titleText={title}
          bgImage={
            pathLen == 2 ? useBaseUrl("/img/mdx-page/header-bg.png") : ""
          }
        />

        <div className={styles.mdxPageWrapper}>
          <div className={clsx("col", !hideTableOfContents && "col--8")}>
            {unlisted && <Unlisted />}
            <article>
              <MDXContent>
                <MDXPageContent />
              </MDXContent>
            </article>
          </div>

          {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
            <div
              className={clsx("col col--2", styles.rightContent)}
              style={{ marginLeft: 50 }}
            >
              <TOC
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            </div>
          )}
        </div>
      </CommonLayout>
    </HtmlClassNameProvider>
  );
}
