import Translate from "@docusaurus/Translate";
import { OUR_ROADMAP } from "@site/src/consts/homeContent";
import clsx from "clsx";
import styles from "./styles.module.scss";

export default function OurRoadmap() {
  const itemListGrid = OUR_ROADMAP.list.slice(0, 6).map((item, i) => {
    return (
      <div
        className={clsx(styles.listItem, styles[`listItem${i + 1}`])}
        key={i}
      >
        <span className={styles.icon}></span>
        <div className={styles.itemTitle}>{item.title}</div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className="global-width-center">
        <div className={styles.wrap}>
          <div className={styles.bg}></div>
          <div className={styles.title}>
            <Translate>{OUR_ROADMAP.title}</Translate>
            <div className={styles.subTitle}>{OUR_ROADMAP.subTitle}</div>
          </div>
          <div className={styles.showList}>{itemListGrid}</div>
        </div>
      </div>
    </div>
  );
}
