import { HOME_HEADER_TIPS, LINKS } from "@site/src/consts/homeContent";
import celebrate from "@site/static/img/celebrate.png";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";

export default function HCard() {
  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Analytics", "AI", "Analytics and AI"],
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
            <span>{HOME_HEADER_TIPS}</span>
          </span>
        </div>
        <div className={styles.highText}>
          <div className={styles.textWrap}>
            <div>Next Generation</div>
            <div>Unified Database for</div>
            <div className={styles.typewriterText}>
              <span ref={el}></span>
            </div>
          </div>
          <div className={styles.textDesc}>
            <span>Open, Friendly, Advanced</span>
          </div>
        </div>
        <div className={clsx(styles.btnWrap, "link-wrap")}>
          <LinkWithBaseUrl to={LINKS.discoverMore}>
            <span className={styles.more}>Discover More</span>
          </LinkWithBaseUrl>
          <LinkWithBaseUrl to={LINKS.github}>
            <span className={styles.hub}>View on Github</span>
          </LinkWithBaseUrl>
        </div>
      </div>
      <div className={styles.leftBox}></div>
      <div className={styles.rightBox}></div>
    </div>
  );
}
