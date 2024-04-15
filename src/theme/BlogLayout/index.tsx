import { useLocation } from "@docusaurus/router";
import BreadCrumbs from "@site/src/components/common/Breadcrumbs";
import type { Props } from "@theme/BlogLayout";
import Layout from "@theme/Layout";
import clsx from "clsx";
import { useEffect, useState } from "react";
import BlogSidebar from "../BlogSidebar";
import styles from "./styles.module.scss";

export default function BlogLayout(props: Props & { items: any }): JSX.Element {
  const [path, setPath] = useState<{ name: string; href?: string }[]>();
  const { sidebar, toc, children, ...layoutProps } = props;

  const location = useLocation();

  useEffect(() => {
    let pattern = /^\/(blog)\/(.+)$/;
    let pathname = location.pathname.replace("/zh", "");
    let matches = pathname.match(pattern);
    if (!matches) {
      setPath([]);
    } else {
      setPath([
        {
          name: matches[1][0].toUpperCase() + matches[1].slice(1),
          href: "/blog",
        },
        { name: matches[2][0].toUpperCase() + matches[2].slice(1) },
      ]);
    }
  }, [location]);
  return (
    <Layout {...layoutProps}>
      <div className="blog-container" style={{ marginBottom: 62 }}>
        <div className="flex" style={{ padding: "0 var(--mobile-padding-width)" }}>
          {props.items && <BlogSidebar sidebar={sidebar} items={props.items} />}
          <main
            className={clsx(styles.main, {
              [styles.blogList]: !!props.items,
              [styles.blogDetail]: !props.items,
            })}
            itemScope
            itemType="https://schema.org/Blog"
          >
            <BreadCrumbs className={styles.breadcrumbs} path={path} />
            <div className={styles.listWrap}>{children}</div>
          </main>
          {/* {toc && <div className="col col--2">{toc}</div>} */}
        </div>
      </div>
    </Layout>
  );
}
