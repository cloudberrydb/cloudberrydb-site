import { WANT_TO_CONTRIBUTE } from "@site/src/consts/homeContent";
import styles from "./index.module.scss";

export default function WantToContribute() {
  return (
    <div className={styles.WantToContribute}>
      {WANT_TO_CONTRIBUTE.list.map((item, index) => {
        return (
          <div className={styles.item} key={index}>
            {item.icon ? (
              <div className="icon">
                <img src={item.icon} alt="" />
              </div>
            ) : null}
            <div className={styles.title}>{item.title}</div>
            <div className={styles.content}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );
}
