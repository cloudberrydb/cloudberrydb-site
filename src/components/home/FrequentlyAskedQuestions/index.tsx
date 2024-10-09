import { FREQUENTLY_ASKED_QUESTIONS } from "@site/src/consts/homeContent";
import styles from "./index.module.scss";

export default function frequentlyAskedQuestions() {
  return (
    <div className={styles.frequentlyAskedQuestions}>
      <div className={styles.highTitle}>{FREQUENTLY_ASKED_QUESTIONS.title}</div>
      <div className={styles.contentList}>
        {FREQUENTLY_ASKED_QUESTIONS.list.map((item, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.content}>{item.content}</div>
            <div className={styles.bottomLine}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
