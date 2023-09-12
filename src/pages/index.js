import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const ref = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (!window.Ribbons) {
      return;
    }

    // eslint-disable-next-line no-undef
    new Ribbons({
      colorSaturation: "60%",
      colorBrightness: "50%",
      colorAlpha: 0.2,
      colorCycleSpeed: 5,
      verticalPosition: "random",
      horizontalSpeed: 100,
      ribbonCount: 3,
      strokeSize: 0,
      parallaxAmount: -0.2,
      animateSections: true,
      element: ref.current,
    });
  });

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)} ref={ref}>
      <div className="container">
        <h1 className="hero__title">
          <i className="logo"></i>
        </h1>
        <p className="hero__title">{siteConfig.tagline}</p>
        <p className="hero__subtitle">Open, Friendly, Advanced</p>
        <div className={styles.buttons}>
          <Link
            style={{ marginRight: "12px" }}
            className="button button--secondary button--lg"
            to="/docs/"
          >
            Discover more
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/cloudberrydb"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Next generation unified database for analytics and AI`}
      description="Cloudberry Database ships with PostgreSQL 14.4 as the kernel. It is 100% open source and helps you leverage the value of your data."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
