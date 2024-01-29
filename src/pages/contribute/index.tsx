import LinkWithBaseUrl from "@site/src/components/common/LinkWithBaseUrl";
import { formatStrHorizontalLine } from "@site/src/utils";
import clsx from "clsx";
import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
import Card from "../../components/contribute/Card";
import TextListItem from "../../components/contribute/TextListItem";
import styles from "../../css/pages/contribute.module.scss";
const linkNavConfig = [
  {
    label: "Find a Way to Contribute",
    id: "",
  },
  {
    label: "Working with Git & GitHub",
  },
  {
    label: "Code Contribution",
  },
  {
    label: "Documentation Contribution",
  },
  {
    label: "Getting Help",
  },
];
linkNavConfig.forEach((item) => {
  item.id = formatStrHorizontalLine(item.label);
});
export default function Contribute(): JSX.Element {
  return (
    <CommonLayout>
      <ColorCard
        titleText="From user to contributor, no contribution is too small. We welcome
            contributions from anyone, new and experienced!"
        subText="   Cloudberry Database is maintained actively by a group of database
          experts by individuals and companies. We believe in the power of
          open source way and community. All contributions are encouraged,
          including code enhancements, bug fixes, feature proposals,
          documents, marketing, etc. We welcome contributions from anyone, new
          and experienced!"
      />
      <div className={styles.globalWidth}>
        <div className={styles.mainContent}>
          <div className={styles.leftContent}>
            <TextListItem
              id={linkNavConfig[0].id}
              title="Find a Way to Contribute"
              content="There are many ways you need to get started. The most common contributions include code, documentation, and community support. You can do a lot of things to make Cloudberry Database better. See the contribution guide to find a way to contribute, how you can ask for help, and what benefits you can get from your contribution."
              linkText="Check the contribution guide"
              href="/contribute/how-to-contribute"
            />
            <TextListItem
              id={linkNavConfig[1].id}
              title="Working with Git & GitHub"
              content="Don't rush to start! You need to learn how to work well with GitHub and Git, which will help you contribute and communicate with other members effectively. Here are the key points you will use in the future."
              linkText="Prepare your skills"
              href="/contribute/git"
            />
            <TextListItem
              style={{ marginTop: 5, paddingBottom: 53 }}
              title="Code Contribution"
              id={linkNavConfig[2].id}
            >
              <div className={clsx(styles.codeContribution, "link-wrap")}>
                <Card
                  className={styles.firstPosition}
                  iconImgSrc="/img/home/feature/mef.png"
                  content="Learn the code conventions, contribution workflow, how to review code, and the contributor checklist."
                  linkText="Make your code contribution"
                  href="/contribute/code"
                />
                <Card
                  iconImgSrc="/img/home/feature/cc.png"
                  content="For any major changes to the Cloudberry Database, please consider initiating one proposal."
                  linkText="See the proposal process"
                  href="/contribute/proposal"
                />
              </div>
            </TextListItem>
            <TextListItem
              id={linkNavConfig[3].id}
              title="Documentation Contribution"
              content="We welcome your documentation contributions, including website, and documentation."
              linkText="Help improve the doc"
              href="/contribute/doc"
            />
            <TextListItem
              id={linkNavConfig[4].id}
              title="Getting Help"
              style={{ marginTop: 10 }}
              content={
                <span>
                  "Feel free to reach out to us in Slack{" "}
                  <span className={styles.highLight}>#dev</span> channels or{" "}
                  <span className={styles.highLight}>
                    <LinkWithBaseUrl to="https://github.com/orgs/cloudberrydb/discussions">
                      GitHub Discussions
                    </LinkWithBaseUrl>
                  </span>{" "}
                  when your contribution is blocked, especially when making your
                  first contribution. Don't be shy, we're happy to help."
                </span>
              }
            />

            <TextListItem
              style={{ marginBottom: 67, marginTop: 16 }}
              title="“ As the next-generation unified database, Cloudberry Database cannot grow without the community. Hope to make our mission with you! ”"
            />
          </div>
          <div className={styles.rightContent}>
            <LinkNav
              className={styles.navLinkWrap}
              config={linkNavConfig}
            ></LinkNav>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
