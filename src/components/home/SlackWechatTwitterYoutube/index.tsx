import { SLACK_TWITTER_TWITTER_WECHAT } from "@site/src/consts/homeContent";
import clsx from "clsx";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";
import styles from "./index.module.scss";
export default function SlackWechatTwitterYoutube() {
  return (
    <>
      <div className={styles.content}>
        <div className={clsx(styles.listWrap, "link-wrap")}>
          {SLACK_TWITTER_TWITTER_WECHAT.list.map((item, index) => (
            <LinkWithBaseUrl
              href={item.link}
              className={styles.item}
              key={index}
            >
              <img src={item.icon} alt="" />
              <div className={styles.itemTitle}>{item.title}</div>
              <div className={styles.itemDesc}>{item.desc}</div>
            </LinkWithBaseUrl>
          ))}
        </div>
        <div className={styles.bg}></div>
      </div>
    </>
  );
}
