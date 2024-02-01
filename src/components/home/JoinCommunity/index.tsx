import styles from "./styles.module.scss";

// links
import { LINKS } from "@site/src/consts/homeContent";
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
          <div className={styles.title}>Join the Community</div>
          <div className={styles.content}>
            Cloudberry Database has a growing open source community, with
            contributors from around the globe building features, documentation,
            and assisting other users. There are many ways to contribute to
            Cloudberry Database, and you can easily find the ones that suit your
            skills and interests to{" "}
            <b>
              <LinkWithBaseUrl style={{ color: "inherit" }} to={"/contribute"}>
                begin your contribution
              </LinkWithBaseUrl>
            </b>{" "}
            journey. Additionally, our community is always there to{" "}
            <b>
              <LinkWithBaseUrl style={{ color: "inherit" }} to="/support">
                help and provide support
              </LinkWithBaseUrl>
            </b>{" "}
            whenever you need it.
          </div>
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
