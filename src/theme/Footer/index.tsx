import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import LinkWithBaseUrl from "@site/src/components/common/LinkWithBaseUrl";
import { LINKS } from "@site/src/consts/homeContent";
import useNavToTarget from "@site/src/hooks/useNavToTarget";
import GithubSvg from "@site/static/img/github.svg";
import LinkedIn from "@site/static/img/linked-in.svg";
import SecuritySvg from "@site/static/img/security.svg";
import TwitterSvg from "@site/static/img/twitter.svg";
import WechatSvg from "@site/static/img/wechat.svg";
import YoutubeSvg from "@site/static/img/youtube.svg";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface LinkItem {
  title: string;
  items: {
    href?: string;
    label?: string;
    to?: string;
  }[];
}

export default function Footer() {
  const navToTarget = useNavToTarget();
  const handleOpen = (url) => {
    navToTarget(url, "_blank");
  };

  const handleCheckLang = () => {
    const langStr = "/zh";
    // check lang
    let href = location.href;
    let pathname = location.pathname;
    const hash = location.hash;

    if (href.includes(langStr)) {
      pathname = pathname.replace(langStr, "");
      navToTarget(pathname + hash, "_self", true);
    } else {
      navToTarget(langStr + pathname + hash, "_self", true);
    }
  };

  const { siteConfig } = useDocusaurusContext();
  const footerConfig = siteConfig.themeConfig.footer;
  const links = (footerConfig as any).links as LinkItem[];

  const footerLinks = links.map((link, i) => {
    return (
      <div className={styles.footerLink} key={i}>
        <div className={styles.footerLinkTitle}>{link.title}</div>
        {link.items.map((item, i) => {
          return (
            <div className={styles.footerLinkItem} key={i}>
              <LinkWithBaseUrl
                to={item.href || item.to}
                target={item.to ? "_self" : "_blank"}
              >
                {item.label}
              </LinkWithBaseUrl>
            </div>
          );
        })}
      </div>
    );
  });
  Object.keys(LINKS).forEach((key) => {
    LINKS[key] = useBaseUrl(LINKS[key]);
  });

  return (
    <div className={clsx(styles.wrap)}>
      <div className={styles.mainWrap}>
        <div className={styles.linksWrap}>{footerLinks}</div>
        <div className={styles.logoLinkWrap}>
          <div className={styles.logoWrap}>
            <img
              className={styles.logo}
              src={useBaseUrl((footerConfig as any).logo.src)}
              alt=""
            />
            <img
              className={styles.swap}
              onClick={handleCheckLang}
              src={useBaseUrl("/img/en_zh.png")}
              alt=""
            />
          </div>
          <div className={styles.links}>
            <GithubSvg
              className={styles.item}
              cursor="pointer"
              onClick={() => handleOpen(LINKS.github)}
            />
            <TwitterSvg
              className={styles.item}
              cursor="pointer"
              onClick={() => handleOpen(LINKS.twitter)}
            />
            <YoutubeSvg
              className={styles.item}
              cursor="pointer"
              onClick={() => handleOpen(LINKS.youtube)}
            />
            <SecuritySvg
              className={styles.item}
              cursor="pointer"
              onClick={() => handleOpen(LINKS.community)}
            />
            <LinkedIn
              className={styles.item}
              cursor="pointer"
              onClick={() => handleOpen(LINKS.linkedIn)}
            />
            <WechatSvg
              className={styles.item}
              cursor="pointer"
              onClick={() => handleOpen(LINKS.wechat)}
            />
          </div>
        </div>
      </div>
      <div className={styles.copyright}>{(footerConfig as any).copyright}</div>
    </div>
  );
}
