import styles from "./styles.module.scss";

// links
import Translate from "@docusaurus/Translate";
import { JOIN_COMMUNITY, LINKS } from "@site/src/consts/homeContent";
import GithubSvg from "@site/static/img/github.svg";
import SecuritySvg from "@site/static/img/security.svg";
import TwitterSvg from "@site/static/img/twitter.svg";
import WechatSvg from "@site/static/img/wechat.svg";
import YoutubeSvg from "@site/static/img/youtube.svg";
import LinkWithBaseUrl from "../../common/LinkWithBaseUrl";

export default function JoinCommunity() {
  return (
    <div className={styles.wrap}>
      <div className="global-width-center">
        <div className={styles.rect}>
          <div className={styles.title}>
            <Translate>Join the Community</Translate>
          </div>
          <div className={styles.content}>{JOIN_COMMUNITY.content}</div>
          <div className={styles.links}>
            <LinkWithBaseUrl href={LINKS.github}>
              <GithubSvg className={styles.item} cursor="pointer" />
            </LinkWithBaseUrl>

            <LinkWithBaseUrl href={LINKS.twitter}>
              <TwitterSvg className={styles.item} cursor="pointer" />
            </LinkWithBaseUrl>

            <LinkWithBaseUrl href={LINKS.youtube}>
              <YoutubeSvg className={styles.item} cursor="pointer" />
            </LinkWithBaseUrl>

            <LinkWithBaseUrl href={LINKS.community}>
              <SecuritySvg className={styles.item} cursor="pointer" />
            </LinkWithBaseUrl>

            <LinkWithBaseUrl href={LINKS.wechat}>
              <WechatSvg className={styles.item} cursor="pointer" />
            </LinkWithBaseUrl>
          </div>
        </div>
      </div>
    </div>
  );
}
