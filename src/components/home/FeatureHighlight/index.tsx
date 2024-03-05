import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FEATURE_HIGHLIGHT } from "@site/src/consts/homeContent";
import styles from "./styles.module.scss";

export default function FeatureHighlight() {

  const itemTop = FEATURE_HIGHLIGHT.slice(0, 3).map((item, i) => {
    return (
      <div className={styles.listItem} key={i}>
        <img src={useBaseUrl(item.icon)} alt="" />
        <div className={styles.itemTitle}>{item.title}</div>
        <div className={styles.itemContent}>{item.content}</div>
      </div>
    );
  });
  const itemBottom = FEATURE_HIGHLIGHT.slice(3, 6).map((item, i) => {
    return (
      <div className={styles.listItem} key={i}>
        <img src={useBaseUrl(item.icon)} alt="" />
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
          <div className={styles.showList}>
            {itemTop}
            {itemBottom}
          </div>
        </div>
      </div>
    </div>
  );
}
