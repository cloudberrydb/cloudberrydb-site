import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.scss";

import { WHY_CLOUDBERRY_DATABASE } from "@site/src/consts/homeContent";

export default function WhyCloudberryDatabase() {
  const itemDom = WHY_CLOUDBERRY_DATABASE.map((item, i) => {
    return (
      <div className={styles.item} key={i}>
        <img className={styles.img} src={useBaseUrl(item.pic)} alt="" />
        <div className={styles.title}>{item.title}</div>
        <div className={styles.desc}>{item.desc}</div>
      </div>
    );
  });
  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles.left}>
          <img src={useBaseUrl("/img/home/wcd.png")} alt="" />
          <span className={styles.text}>Why Cloudberry Database</span>
        </div>
        <div className={styles.right}>{itemDom}</div>
      </div>
    </div>
  );
}
