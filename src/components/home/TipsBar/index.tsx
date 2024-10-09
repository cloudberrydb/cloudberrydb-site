import { TIPS_CONTENT } from "@site/src/consts/homeContent";
import { useState } from "react";
import styles from "./styles.module.scss";

export default function TipsBar() {
  const [isShowTips, setShowTips] = useState(true);
  const headerTips = isShowTips ? (
    <div className={styles.tipsWrap}>
      <div className={styles.tipsContent}>
        <div className={styles.text}>{TIPS_CONTENT}</div>
        <div className={styles.close} onClick={() => setShowTips(false)}>
          <img src="/img/home/hcard/close.svg" alt="" />
        </div>
      </div>
    </div>
  ) : null;
  return headerTips;
}
