import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
import Card from "../../components/community/Card";
import CardWrap from "../../components/community/CardWrap";
import styles from "../../css/pages/community.module.scss";
import { formatStrHorizontalLine } from "../../utils";
import EventsIcon from "/img/community/events.svg";
import ForDevIcon from "/img/community/for-dev.svg";
import ReportBugsIcon from "/img/community/report-bugs.svg";
import ShareNewIdeasIcon from "/img/community/share-new-ideas.svg";
import SlackIcon from "/img/community/slack.svg";
import WechatIcon from "/img/community/wechat.svg";

const linkNavConfig = [
  {
    label: "Get Involved",
    id: "",
  },
  {
    label: "Get Support",
    id: "",
  },
  {
    label: "Stay Informed",
    id: "",
  },
  {
    label: "Guidelines and Policy",
    id: "",
  },
];
linkNavConfig.forEach((item) => {
  item.id = formatStrHorizontalLine(item.label);
});
export default function Community(): JSX.Element {
  return (
    <CommonLayout>
      <ColorCard
        titleText="We're the community because of you. Be part of us now."
        subText="Cloudberry Database is maintained actively by a group of database experts by individuals and companies. We believe in the power of open source way and community. Explore ways to get involved, and stay up-to-date with the latest announcements and events."
      />
      <div className={styles.main}>
        <div className={styles.leftContent}>
          <CardWrap title="Get Involved" style={{ marginTop: 68 }}>
            <div className={styles.cardLine} style={{ height: 216 }}>
              <Card
                icon={<SlackIcon fill="#fff" />}
                title="Slack"
                content="The global channel for community members to chat with others in real time. Read our Slack guide to get started."
                link={{ text: "Join to talk", href: "/community/slack" }}
              />
              <Card
                icon={<WechatIcon fill="#fff" />}
                title="WeChat Groups"
                content="You can ask to join the WeChat groups if you prefer using WeChat(in Mandarin Chinese) for real-time text chatting or community discussions."
                link={{
                  text: "Join the WeChat group",
                  href: "/community/wechat",
                }}
              />
              <Card
                icon={<EventsIcon fill="#fff" />}
                title="Events"
                content="Subscribe to the events calendar to find more community events, like meetups, webinars, conferences, and more."
                link={{
                  text: "Subscribe to the calendar",
                  href: "/community/events",
                }}
              />
            </div>
            <div className={styles.cardLine} style={{ height: 216 }}>
              <Card
                icon={<ReportBugsIcon fill="#fff" />}
                title="Report bugs"
                content="If you find any bugs in Cloudberry Database's core, please submit them on GitHub. More eyes result in fewer bugs."
                link={{
                  text: "File an issue on GitHub",
                  href: "https://github.com/cloudberrydb/cloudberrydb/issues",
                }}
              />
              <Card
                icon={<ForDevIcon fill="#fff" />}
                title="Share new ideas / Make feature requests"
                content="Share your ideas and request new features on GitHub Discussions to help shape the future of the Cloudberry Database."
                link={{
                  text: "Share your ideas",
                  href: "https://github.com/orgs/cloudberrydb/discussions/new?category=ideas-feature-requests",
                }}
              />
              <Card
                icon={<ShareNewIdeasIcon fill="#fff" />}
                title="For developers"
                content="Join the group of contributors, where both new and experienced individuals are welcome to contribute their unique skills and perspectives."
                link={{
                  text: "See the contribution guide",
                  href: "/contribute",
                }}
              />
            </div>
          </CardWrap>
          <CardWrap title="Get Support">
            <div className={styles.cardLine} style={{ height: 182 }}>
              <Card
                style={{ width: 474 }}
                title="Documentation"
                content="The knowledge base is where you can find most of the usage and troubleshooting in the Cloudberry Database."
                link={{ text: "View the doc", href: "/docs" }}
              />
              <Card
                style={{ width: 474 }}
                title="Q&A"
                content="Ask for help on GitHub Discussions when running or developing Cloudberry Database. We're always here to assist you."
                link={{
                  text: "Ask for help",
                  href: "https://github.com/orgs/cloudberrydb/discussions/categories/q-a",
                }}
              />
            </div>
          </CardWrap>
          <CardWrap title="Stay Informed">
            <div className={styles.cardLine} style={{ height: 195 }}>
              <Card
                style={{ width: 474 }}
                title="Blog"
                content="The Blog contains regular blog posts from the team and the community, including the monthly newsletter, release posts, internal technologies, events, and announcements."
                link={{ text: "Read the latest", href: "/blog" }}
              />
              <Card
                style={{ width: 474 }}
                title="Twitter"
                content='For news and updates, follow @cloudberrydb on Twitter("X" now).'
                link={{
                  text: "Follow us",
                  href: "https://twitter.com/cloudberrydb",
                }}
              />
            </div>
            <div className={styles.cardLine} style={{ height: 176 }}>
              <Card
                title="Announcements"
                content="News and updates from the team on the GitHub Discussions channel."
                link={{
                  text: "Stay informed with news",
                  href: "https://github.com/orgs/cloudberrydb/discussions/categories/announcements",
                }}
              />
              <Card
                title="WeChat Official Account"
                content="The Mandarin Chinese blog channel."
                link={{ text: "Follow us", href: "/community/wechat" }}
              />
              <Card
                title="Youtube"
                content="Get notified about the latest videos by subscribing to the CloudberryDB channel."
                link={{
                  text: "Watch now",
                  href: "https://youtube.com/@cloudberrydb",
                }}
              />
            </div>
          </CardWrap>
          <CardWrap title="Guidelines and Policy">
            <div className={styles.cardLine} style={{ height: 182 }}>
              <Card
                title="Code of Conduct"
                content="Work together to create an open, welcoming, diverse, inclusive, and healthy space for everyone."
                link={{ text: "Learn more", href: "/community/coc" }}
              />
              <Card
                title="Brand Guidelines"
                content="The comprehensive guide on how to download and use our logos, names, and fonts."
                link={{
                  text: "Discover the guideline",
                  href: "/community/brand",
                }}
              />
              <Card
                title="Security Policy"
                content="View the security policy to learn how to report security issues to us."
                link={{
                  text: "Learn the security policy",
                  href: "/community/security",
                }}
              />
            </div>
          </CardWrap>
        </div>
        <div className={styles.rightContent}>
          <LinkNav
            className={styles.navLinkWrap}
            config={linkNavConfig}
          ></LinkNav>
        </div>
      </div>
    </CommonLayout>
  );
}
