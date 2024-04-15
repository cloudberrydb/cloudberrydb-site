import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { WHY_CLOUDBERRY_DATABASE } from "@site/src/consts/homeContent";
import styles from "./styles.module.scss";

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
          <span className={styles.text}>
            <Translate>Why Cloudberry Database</Translate>
          </span>
        </div>
        <div className={styles.right}>{itemDom}</div>
      </div>
    </div>
  );
}
