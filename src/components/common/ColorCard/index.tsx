import clsx from "clsx";
import { ColorHeader } from "../ColorHeader";
import styles from "./styles.module.scss";
interface IProps {
  titleText: string;
  subText: string;
  bgImage?: string;
  className?: string;
}
export default function ColorCard(props: IProps) {
  return (
    <ColorHeader bgImg={props.bgImage}>
      <div className={clsx(styles.main, props.className)}>
        <div className={styles.content}>
          <div className={styles.bigText}>{props.titleText}</div>
          <div className={styles.smallText}>{props.subText}</div>
        </div>
      </div>
    </ColorHeader>
  );
}
