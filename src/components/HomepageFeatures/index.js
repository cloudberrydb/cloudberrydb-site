import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import icon_use_cases from "/static/img/feature/icon_use_cases.png";
import icon_elastic_scaling from "/static/img/feature/icon_elastic_scaling.png";
import icon_data_anlytical from "/static/img/feature/icon_data_anlytical.png";
import icon_mainstream_technology_ai from "/static/img/feature/icon_mainstream_technology_ai.png";
import icon_postgresql from "/static/img/feature/icon_postgresql.png";
import icon_enterprise_features from "/static/img/feature/icon_enterprise_features.png";
import icon_open_source from "/static/img/feature/icon_open_source.png";
import icon_production from "/static/img/feature/icon_production.png";
import icon_database_compatibility from "/static/img/feature/icon_database_compatibility.png";

const FeatureList = [
  {
    logo: icon_use_cases,
    title: "More Use Cases",
    description: (
      <>
        Cloudberry Database can be used in different scenarios, including batch
        processing data warehouse offline, building data warehouse in real-time,
        and more. Also, you can use it as an alternative to existing MPP
        databases.
      </>
    ),
  },
  {
    logo: icon_elastic_scaling,
    title: "Highly Elastic Scaling Capability",
    description: (
      <>
        Cloudberry Database can independently scale out computing and storage
        resources to achieve fully elastic adjustments in throughput, response
        time, and data capacity.
      </>
    ),
  },
  {
    logo: icon_data_anlytical,
    title: "Strong Analytical Capability",
    description: (
      <>
        Inheriting the rich analytical features from PostgreSQL and Greenplum
        Database, Cloudberry Database leverages them to the cloud platform, and
        seamlessly integrates the mainstream ETL and BI tools.
      </>
    ),
  },
  {
    logo: icon_mainstream_technology_ai,
    title: "Catch up with Mainstream Technology",
    description: (
      <>
        Cloudberry Database supports mainstream data analytical features such as
        machine learning, graph calculation, and spatiotemporal analyses.
      </>
    ),
  },
  {
    logo: icon_postgresql,
    title: "PostgreSQL 14 Inside",
    description: (
      <>
        Cloudberry Database adopts the newer PostgreSQL version 14 inside to let
        users enjoy more with the backend global community.
      </>
    ),
  },
  {
    logo: icon_enterprise_features,
    title: "More Enterprise Features",
    description: (
      <>
        Cloudberry Database supports multi-tenant management, relational data
        models, standard JDBC and ODBC interfaces, and more.
      </>
    ),
  },
];

const FeatureList2 = [
  {
    logo: icon_open_source,
    title: "100% Open Source",
    description: (
      <>
        Cloudberry Database is 100% open-sourced with an active community. You
        can find all the source code on GitHub as you need.
      </>
    ),
  },
  {
    logo: icon_production,
    title: "Production Ready",
    description: (
      <>
        Cloudberry Database has been deployed in many critical production
        environments with high availability.
      </>
    ),
  },
  {
    logo: icon_database_compatibility,
    title: "PostgreSQL Compatibility",
    description: (
      <>
        Cloudberry Database is highly compatible with PostgreSQL, enabling you
        to leverage the advantages of the strong PostgreSQL ecosystem.
      </>
    ),
  },
];

const CommunityList = [
  {
    title: "GitHub",
    href: "https://github.com/cloudberrydb",
    className: "header-github-link",
  },
  {
    title: "Twitter",
    href: "https://twitter.com/cloudberrydb",
    className: "header-twitter-link",
  },
  {
    title: "Youtube",
    href: "https://youtube.com/@cloudberrydb",
    className: "header-youtube-link",
  },
  {
    title: "Slack",
    href: "https://communityinviter.com/apps/cloudberrydb/welcome",
    className: "header-slack-link",
  },
];

function Feature({ title, description, logo }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center"></div>
      <div className="text--center padding-horiz--md">
        <i
          className={styles.titleLogo}
          style={{
            backgroundImage: `url(${logo})`,
          }}
        />
        <h3>{title}</h3>
        <p className="text--left">{description}</p>
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
      <div class={styles.wrapper}>
        <div className="container">
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Join the Community</h2>
            <p align="left">
              Cloudberry Database has a growing open source community, with
              contributors from around the globe building features,
              documentation, and assisting other users. There are many ways to
              contribute to Cloudberry Database, and you can easily find the
              ones that suit your skills and interests to{" "}
              <a href="/contribute/how-to-contribute" target="blank">
                begin your contribution journey
              </a>
              . Additionally, our community is always there to{" "}
              <a href="/support" target="blank">
                help and provide support
              </a>{" "}
              whenever you need it.
            </p>
            <div className="row">
              {CommunityList.map((props, idx) => (
                <div className={clsx("col col--3")}>
                  <div className={styles.CommunityItemBox}>
                    <a
                      target="_blank"
                      href={props.href}
                      className={`${props.className} logo`}
                    ></a>
                    <span>{props.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
