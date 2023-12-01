import React from 'react';
import styles from '/src/css/VersionBadge.module.css';

export default function VersionBadge({ since, version }) {
    return (
      <span className={styles.versionBadgeContainer}>
        <span className={styles.versionBadge}>
          <span className={styles.since}>{since}</span>
          <span className={styles.version}>{version}</span>
        </span>
      </span>
    );
  }