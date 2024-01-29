import { useHistory, useLocation } from "@docusaurus/router";
import { useScrollHash } from "@site/src/hooks/useScrollHash";
import clsx from "clsx";
import { useEffect } from "react";
import styles from "./styles.module.scss";
interface IProps {
  className?: string;
  style?: React.CSSProperties;
  config: {
    label: string;
    id?: string;
  }[];
  defaultHash?: string;
}

// scroll to element
function handleClickScroll(hashId: string) {
  const element = document.querySelector(`[data-id="${hashId}"]`);
  if (!element) return;
  const elementTop = element.getBoundingClientRect().top;

  const alreadyScrolled = window.scrollY;
  const elementTarget = 100;
  window.scrollTo({
    top: elementTop + alreadyScrolled - elementTarget,
    behavior: "instant",
  });
}

export default function LinkNav(props: IProps) {
  useScrollHash();
  const { hash } = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (hash === "") {
      history.replace({
        hash: props.defaultHash || props.config[0].id,
      });
    }
  }, []);
  return (
    <div className={props.className} style={props.style}>
      <ul className={styles.nav}>
        {props.config.map((item, index) => {
          return (
            <li
              className={clsx(
                styles.item,
                hash === `#${item.id}` && styles.active
              )}
              key={index}
            >
              <a
                href={`#${item.id}`}
                onClick={() => handleClickScroll(item.id)}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
