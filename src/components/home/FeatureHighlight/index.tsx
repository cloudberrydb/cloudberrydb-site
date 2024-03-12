import Translate from "@docusaurus/Translate";
import { FEATURE_HIGHLIGHT } from "@site/src/consts/homeContent";
import clsx from "clsx";
import styles from "./styles.module.scss";

export default function FeatureHighlight() {
  const itemListGrid = FEATURE_HIGHLIGHT.slice(0, 6).map((item, i) => {
    return (
      <div
        className={clsx(styles.listItem, styles[`listItem${i + 1}`])}
        key={i}
      >
        <span className={styles.icon}></span>
        <div className={styles.itemTitle}>{item.title}</div>
        <div className={styles.itemContent}>{item.content}</div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className="global-width-center">
        <div className={styles.wrap}>
          <div className={styles.title}>
            <Translate>Feature Highlights</Translate>
          </div>
          <div className={styles.showList}>{itemListGrid}</div>
        </div>
      </div>
    </div>
  );
}
