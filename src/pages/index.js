import React, {useEffect, useRef} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const ref = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line no-undef
    console.log(123123, window.Ribbons)
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
    <header className={clsx('hero hero--primary', styles.heroBanner)} ref={ref}>
      <div className="container">
        <h1 className="hero__title">
          <img src="/img/logo.svg" />
        </h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Discover more
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Learn about Cloudberry Database in just a few minutes.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}