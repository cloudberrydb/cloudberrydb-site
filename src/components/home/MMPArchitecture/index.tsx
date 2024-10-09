import { MMP_ARCHITECTURE } from "@site/src/consts/homeContent";
import styles from "./index.module.scss";

export default function MMPArchitecture() {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>{MMP_ARCHITECTURE.title}</div>
      <div className={styles.list}>
        {MMP_ARCHITECTURE.list.map((item) => {
          return (
            <div className={styles.item} key={item.title}>
              <img className={styles.itemPic} src={item.pic} alt="" />
              <div className={styles.itemTitle}>{item.title}</div>
              <div className={styles.itemContent}>{item.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
