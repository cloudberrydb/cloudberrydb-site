import clsx from "clsx";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";
import GreaterThan from "/img/greater_than.svg";

interface IProps {
  style?: React.CSSProperties;
  title?: string;
  content?: string;
  link: {
    text: string;
    href: string;
  };
}
export default function Card(props: IProps) {
  return (
    <div className={clsx(styles.card, "link-wrap")} style={props.style}>
      <LinkWithBaseUrl to={props.link.href}>
        <div className={styles.title}>{props.title}</div>
        <div className={clsx(styles.content, "sub-text")}>{props.content}</div>
        <div className={styles.link}>
          <span>{props.link.text}</span>
          <GreaterThan />
        </div>
      </LinkWithBaseUrl>
    </div>
  );
}
