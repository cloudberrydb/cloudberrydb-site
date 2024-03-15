import clsx from "clsx";
import styles from "./styles.module.scss";

import { useIsDarkMode } from "@site/src/hooks/useColorMode";
import GreaterThan from "@site/static/img/greater_than.svg";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";

interface IProps {
  iconImgSrc?: string;
  content: string;
  linkText: string;
  href: string;
  className?: string;
}
export default function Card({ content, linkText, href, className }: IProps) {
  return (
    <LinkWithBaseUrl to={href} className={clsx(styles.wrap, className)}>
      <span className={styles.tIcon}></span>
      <div className={styles.content}>{content}</div>
      <div className={styles.link}>
        {linkText && (
          <>
            <span>{linkText}</span>
            <GreaterThan className={styles.icon} />
          </>
        )}
      </div>
    </LinkWithBaseUrl>
  );
}
