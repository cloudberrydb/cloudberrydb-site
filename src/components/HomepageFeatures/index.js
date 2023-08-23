import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'More Use Cases',
    description: (
      <>
        Cloudberry Database can be used in different scenarios, including batch processing data warehouse offline, building data warehouse in real-time, and more. Also, you can use it as an alternative to existing MPP databases.
      </>
    ),
  },
  {
    title: 'Highly Elastic Scaling Capability',
    description: (
      <>
        Cloudberry Database can independently scale out computing and storage resources to achieve fully elastic adjustments in throughput, response time, and data capacity.
      </>
    ),
  },
  {
    title: 'Strong Analytical Capability',
    description: (
      <>
        Inheriting the rich analytical features from PostgreSQL and Greenplum Database, Cloudberry Database leverages them to the cloud platform, and seamlessly integrates the mainstream ETL and BI tools.
      </>
    ),
  },
  {
    title: 'Catch up with Mainstream Technology',
    description: (
      <>
        Cloudberry Database supports mainstream data analytical features such as machine learning, graph calculation, and spatiotemporal analyses.
      </>
    ),
  },
  {
    title: 'PostgreSQL 14 Inside',
    description: (
      <>
        Cloudberry Database adopts the newer PostgreSQL version 14 inside to let users enjoy more with the backend global community.
      </>
    ),
  },
  {
    title: 'More Enterprise Features',
    description: (
      <>
        Cloudberry Database supports multi-tenant management, relational data models, standard JDBC and ODBC interfaces, and more.
      </>
    ),
  },
];

const FeatureList2 = [
  {
    title: "100% Open Source",
    description: (
      <>
        Cloudberry Database is 100% open-sourced with an active community. You can find all the source code on GitHub as you need.
      </>
    ),
  },
  {
    title: "Production Ready",
    description: (
      <>
        Cloudberry Database has been deployed in many critical production environments with high availability.
      </>
    ),
  },
  {
    title: "PostgreSQL Compatibility",
    description: (
      <>
        Cloudberry Database is highly compatible with PostgreSQL, enabling you to leverage the advantages of the strong PostgreSQL ecosystem.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div class={styles.wrapper}>
        <div className="container">
          <div className={styles.card} isDark>
            <h2 className={styles.cardTitle}>Feature Highlights</h2>
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div class={styles.wrapper}>
        <div className="container">
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Why Cloudberry Database</h2>
            <div className="row">
              {FeatureList2.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}