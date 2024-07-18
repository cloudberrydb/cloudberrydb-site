import styles from "@site/src/css/pages/contribute.module.scss";
import clsx from "clsx";
import LinkWithBaseUrl from "../components/common/LinkWithBaseUrl";
import Card from "../components/contribute/Card";
import { formatStrHorizontalLine, isZhLangrage } from "../utils";
interface ConfigProps {
  headerCard: {
    titleText: string;
    subTitle: string;
  };
  textListItems: {
    title: string;
    content?: React.ReactNode;
    href?: string;
    linkText?: string;
    style?: React.CSSProperties;
    children?: React.ReactElement;
    id?: string;
  }[];
}
let CONTRIBUTE_PAGE_CONFIG: ConfigProps = {
  headerCard: {
    titleText:
      "From user to contributor, no contribution is too small. We welcome contributions from anyone, new and experienced!",
    subTitle: `Cloudberry Database is maintained actively by a group of database
            experts by individuals and companies. We believe in the power of
            open source way and community. All contributions are encouraged,
            including code enhancements, bug fixes, feature proposals,
            documents, marketing, etc. We welcome contributions from anyone, new
            and experienced!`,
  },
  textListItems: [
    {
      title: "Find a Way to Contribute",
      content:
        "There are many ways you need to get started. The most common contributions include code, documentation, and community support. You can do a lot of things to make Cloudberry Database better. See the contribution guide to find a way to contribute, how you can ask for help, and what benefits you can get from your contribution.",
      linkText: "Check the contribution guide",
      href: "/contribute/how-to-contribute",
    },
    {
      title: "Working with Git & GitHub",
      content:
        "Don't rush to start! You need to learn how to work well with GitHub and Git, which will help you contribute and communicate with other members effectively. Here are the key points you will use in the future.",
      linkText: "Prepare your skills",
      href: "/contribute/git",
    },
    {
      style: { marginTop: 5, paddingBottom: 53 },
      title: "Code Contribution",
      children: (
        <div className={clsx(styles.codeContribution, "link-wrap")}>
          <Card
            className={styles.firstPosition}
            iconImgSrc="/img/home/feature/mef-light.svg"
            content="Learn the code conventions, contribution workflow, how to review code, and the contributor checklist."
            linkText="Make your code contribution"
            href="/contribute/code"
          />
          <Card
            className={styles.secondPosition}
            iconImgSrc="/img/home/feature/muc-light.svg"
            content="For any major changes to the Cloudberry Database, please consider initiating one proposal."
            linkText="See the proposal process"
            href="/contribute/proposal"
          />
        </div>
      ),
    },
    {
      title: "Documentation Contribution",
      content:
        "We welcome your documentation contributions, including website, and documentation.",
      linkText: "Help improve the doc",
      href: "/contribute/doc",
    },
    {
      title: "Getting Help",
      style: { marginTop: 10 },
      content: (
        <span>
          "Feel free to reach out to us in Slack{" "}
          <span className={styles.highLight}>#dev</span> channels or{" "}
          <span className={styles.highLight}>
            <LinkWithBaseUrl to="https://github.com/orgs/cloudberrydb/discussions">
              GitHub Discussions
            </LinkWithBaseUrl>
          </span>{" "}
          when your contribution is blocked, especially when making your first
          contribution. Don't be shy, we're happy to help."
        </span>
      ),
    },
    {
      style: { marginBottom: 67, marginTop: 16 },
      title:
        "“ As the next-generation unified database, Cloudberry Database cannot grow without the community. Hope to make our mission with you! ”",
    },
  ],
};

// zh language
if (isZhLangrage()) {
  CONTRIBUTE_PAGE_CONFIG = {
    headerCard: {
      titleText:
        "从用户到贡献者，贡献不分大小。无论新老，我们都欢迎你成为贡献者！",
      subTitle: `Cloudberry Database 由一群具备行业顶尖水平的数据库专家团队负责维护。我们相信开源和社区的力量。我们鼓励所有的贡献，包括代码增强、Bug 修复、功能提案、文档、市场营销等。无论新手还是老鸟，我们都欢迎。`,
    },
    textListItems: [
      {
        title: "探索贡献方式",
        content:
          "贡献多种多样。最常见的贡献方式包括代码贡献、文档贡献和社区支持。你可以做很多事情让 Cloudberry Database 变得更好。欢迎参阅贡献指南，了解如何做出贡献、寻求帮助以及你可以从贡献中获得什么好处。",
        linkText: "参阅贡献指南",
        href: "/contribute/how-to-contribute",
      },
      {
        title: "学会使用 Git & GitHub",
        content:
          "不要急于开始！你需要学习如何更好地使用 GitHub 和 Git 进行协作，这对你的贡献很有帮助，并帮你和其他成员高效沟通。本文档列出了后续会用到的一些关键点。",
        linkText: "准备关键技能",
        href: "/contribute/git",
      },
      {
        style: { marginTop: 5, paddingBottom: 53 },
        title: "代码贡献",
        children: (
          <div className={clsx(styles.codeContribution, "link-wrap")}>
            <Card
              className={styles.firstPosition}
              iconImgSrc="/img/home/feature/mef.png"
              content="了解代码规范、贡献流程、如何审阅代码，以及贡献者检查清单。"
              linkText="开始代码贡献"
              href="/contribute/code"
            />
            <Card
              iconImgSrc="/img/home/feature/cc.png"
              content="对涉及 Cloudberry Database 的任何重大变更，请考虑发起一项提案。"
              linkText="查看提案流程"
              href="/contribute/proposal"
            />
          </div>
        ),
      },
      {
        title: "文档贡献",
        content:
          "我们欢迎你对网站和文档做贡献。",
        linkText: "帮助改进文档",
        href: "/contribute/doc",
      },
      {
        title: "获取帮助",
        style: { marginTop: 10 },
        content: (
          <span>
            "欢迎在 Slack{" "}
            <span className={styles.highLight}>#dev</span> 频道或{" "}
            <span className={styles.highLight}>
              <LinkWithBaseUrl to="https://github.com/orgs/cloudberrydb/discussions">
                GitHub Discussions
              </LinkWithBaseUrl>
            </span>{" "}
            上向我们咨询关于贡献方面的问题，特别是你在初次贡献遇到卡壳时。不要害羞，我们非常乐意帮大家解决贡献过程中的问题或疑惑。"
          </span>
        ),
      },
      {
        style: { marginBottom: 67, marginTop: 16 },
        title:
          "“作为下一代统一型开源数据库，Cloudberry Database 没有社区就无法成长。希望与你一起实现目标！”",
      },
    ],
  };
}

CONTRIBUTE_PAGE_CONFIG.textListItems.forEach((item) => {
  item.id = formatStrHorizontalLine(item.title);
});

const LINK_NAV_CONFIG = CONTRIBUTE_PAGE_CONFIG.textListItems
  .slice(0, -1)
  .map((item) => {
    return {
      label: item.title,
      id: item.id,
    };
  });

export { CONTRIBUTE_PAGE_CONFIG, LINK_NAV_CONFIG };
