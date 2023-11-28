import clsx from "clsx";
import styles from "./styles.module.scss";
import { formatStrHorizontalLine } from "@site/src/utils";
interface IProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export default function CardWrap(props: IProps) {
  const id = formatStrHorizontalLine(props.title);
  return (
    <div
      className={clsx(styles.cardWrap, "scroll-id-select", "link-wrap")}
      style={props.style}
      data-id={id}
    >
      <div className={styles.title}>{props.title}</div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
