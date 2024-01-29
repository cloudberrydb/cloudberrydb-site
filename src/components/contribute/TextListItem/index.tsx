import GreaterThan from "@site/static/img/greater_than.svg";
import clsx from "clsx";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";
interface IProps {
  id?: string;
  title: string;
  content?: string | React.ReactNode;
  linkText?: string;
  href?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
export default function TextListItem(props: IProps) {
  return (
    <div
      style={props.style}
      className={clsx(styles.wrap, "scroll-id-select", props.className)}
      data-id={props.id}
    >
      <div className={styles.title}>{props.title}</div>
      {(props.content || props.children) && (
        <div className={styles.content}>{props.content || props.children}</div>
      )}
      {props.linkText && (
        <div className={styles.link}>
          <LinkWithBaseUrl to={props.href}>
            <span>{props.linkText}</span>
            <GreaterThan className={styles.icon} />
          </LinkWithBaseUrl>
        </div>
      )}
    </div>
  );
}
