import clsx from "clsx";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";
import GreaterThan from "/img/greater_than.svg";
interface IProps {
  icon?: React.ReactElement;
  title: string;
  content: string;
  link: {
    text: string;
    href: string;
  };
  style?: React.CSSProperties;
}
export default function GetInvolved(props: IProps) {
  return (
    <LinkWithBaseUrl
      to={props.link.href}
      className={clsx(styles.card)}
      style={props.style}
    >
      <div className={styles.header}>
        {props.icon && <span className={styles.icon}>{props.icon}</span>}
        <div className={styles.title}>{props.title}</div>
      </div>
      <div className={styles.content}>{props.content}</div>
      <div className={styles.link}>
        {props.link.text}
        <GreaterThan className={styles.icon} fill="var(--active-color)" />
      </div>
    </LinkWithBaseUrl>
  );
}
