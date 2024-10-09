import Translate, { translate } from "@docusaurus/Translate";
import { LINKS } from "@site/src/consts/homeContent";
import useGetNewBlogList from "@site/src/hooks/useGetNewBlogList";
import { useIsMobile } from "@site/src/hooks/useIsMobile";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./styles.module.scss";

export default function HCard() {
  const el = useRef(null);
  const m = translate({ message: "Analytics  AI  Analytics and AI" });
  const blogs = useGetNewBlogList();
  const newBlog = blogs[0];

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

  const headerDesc = useIsMobile() ? (
    <>
      <div>
        <Translate>Next Generation</Translate>{" "}
        <Translate>Unified Database for</Translate>
      </div>
    </>
  ) : (
    <>
      <div>
        <Translate>Next Generation</Translate>
      </div>
      <div>
        <Translate>Unified Database for</Translate>
      </div>
    </>
  );

  return (
    <div className={clsx(styles.bannerContainer)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.highText}>
            <div className={styles.textWrap}>
              {headerDesc}
              <div>
                {/* <span style={{ color: "#fff" }}>for </span> */}
                <span className={styles.typewriterText}>
                  <span ref={el}></span>
                </span>
              </div>
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
        {!useIsMobile() && (
          <div className={styles.right}>
            <div className={styles.loopRun}>
              <img
                className={styles.centerCircle}
                src="/img/home/hcard/big-circle.svg"
                alt=""
              />
              <div className={clsx(styles.circle, styles.circle1)}>
                Advanced
              </div>
              <div className={clsx(styles.circle, styles.circle3)}>
                Friendly
              </div>
              <div className={clsx(styles.circle, styles.circle5)}>Open</div>
            </div>
          </div>
        )}
        <div className={styles.bline}></div>
      </div>

      <div className={styles.bottomTips}>
        <div className={styles.tipsContent}>
          <div className={styles.text}>
            <img
              className={styles.blogTextIcon}
              src="/img/home/hcard/new.svg"
              alt=""
            />
            <LinkWithBaseUrl to={newBlog.href}>{newBlog.title}</LinkWithBaseUrl>
          </div>
        </div>
      </div>

      <div className={styles.leftBox}></div>
      <div className={styles.rightBox}></div>
    </div>
  );
}
