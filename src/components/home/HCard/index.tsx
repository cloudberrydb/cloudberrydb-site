import Translate, { translate } from "@docusaurus/Translate";
import { HOME_HEADER_TIPS, LINKS } from "@site/src/consts/homeContent";
import celebrate from "@site/static/img/celebrate.png";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";

export default function HCard() {
  const el = useRef(null);
  const m = translate({ message: "Analytics  AI  Analytics and AI" });
  // ["Analytics", "AI", "Analytics and AI"]
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: m.split("  "),
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
    });
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.content}>
        <div className={styles.tipsWrap}>
          <span className={styles.tips}>
            <img src={celebrate} alt="" />
            <span>
              <Translate>{HOME_HEADER_TIPS}</Translate>~
            </span>
          </span>
        </div>
        <div className={styles.highText}>
          <div className={styles.textWrap}>
            <div>
              <Translate>Next Generation</Translate>
            </div>
            <div>
              <Translate>Unified Database for</Translate>
            </div>
            <div className={styles.typewriterText}>
              <span ref={el}></span>
            </div>
          </div>
          <div className={styles.textDesc}>
            <span>
              <Translate>Open, Friendly, Advanced</Translate>
            </span>
          </div>
        </div>
        <div className={clsx(styles.btnWrap, "link-wrap")}>
          <LinkWithBaseUrl to={LINKS.discoverMore}>
            <span className={styles.more}>
              <Translate>Discover More</Translate>
            </span>
          </LinkWithBaseUrl>
          <LinkWithBaseUrl to={LINKS.github}>
            <span className={styles.hub}>
              <Translate>View on Github</Translate>
            </span>
          </LinkWithBaseUrl>
        </div>
      </div>
      <div className={styles.leftBox}></div>
      <div className={styles.rightBox}></div>
    </div>
  );
}
