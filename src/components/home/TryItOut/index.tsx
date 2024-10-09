import { TRY_IT_OUT } from "@site/src/consts/homeContent";
import styles from "./index.module.scss";
export default function tryItOut() {
  return (
    <div className={styles.tryItOut}>
      <div className={styles.title}>{TRY_IT_OUT.title}</div>
      <div className={styles.rectList}>
        {TRY_IT_OUT.list.map((item, index) => (
          <div className={styles.rectItem} key={index}>
            <div className={styles.itemTitle}>{item.title}</div>
            <div className={styles.itemContentWrapper}>
              <div className={styles.itemImg}>{item.img}</div>
              <div className={styles.itemContent}>{item.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.circle}></div>
      <div className={styles.lineL}></div>
      <div className={styles.lineR}></div>
    </div>
  );
}
