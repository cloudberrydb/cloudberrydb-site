import { formatStrHorizontalLine, isZhLangrage } from "../utils";
import EventsIcon from "/img/community/events.svg";
import ForDevIcon from "/img/community/for-dev.svg";
import ReportBugsIcon from "/img/community/report-bugs.svg";
import ShareNewIdeasIcon from "/img/community/share-new-ideas.svg";
import SlackIcon from "/img/community/slack.svg";
import WechatIcon from "/img/community/wechat.svg";

interface CommunityPageConfig {
  headerCard: {
    titleText: string;
    subText: string;
  };
  cardWraps: {
    title: string;
    cardLines: {
      style: React.CSSProperties;
      cards: {
        icon?: React.ReactElement;
        title: string;
        content: string;
        link: {
          text: string;
          href: string;
        };
        style?: React.CSSProperties;
      }[];
    }[];
  }[];
}

let COMMUNITY_PAGE: CommunityPageConfig = {
  headerCard: {
    titleText: "We're the community because of you. Be part of us now.",
    subText:
      "Cloudberry Database is maintained actively by a group of database experts by individuals and companies. We believe in the power of open source way and community. Explore ways to get involved, and stay up-to-date with the latest announcements and events.",
  },
  cardWraps: [
    {
      title: "Get Involved",
      cardLines: [
        {
          style: { height: 216 },
          cards: [
            {
              icon: <SlackIcon fill="#fff" />,
              title: "Slack",
              content:
                "The global channel for community members to chat with others in real time. Read our Slack guide to get started.",
              link: { text: "Join to talk", href: "/community/slack" },
            },
            {
              icon: <WechatIcon fill="#fff" />,
              title: "WeChat Groups",
              content:
                "You can ask to join the WeChat groups if you prefer using WeChat(in Mandarin Chinese) for real-time text chatting or community discussions.",
              link: {
                text: "Join the WeChat group",
                href: "/community/wechat",
              },
            },
            {
              icon: <EventsIcon fill="#fff" />,
              title: "Events",
              content:
                "Subscribe to the events calendar to find more community events, like meetups, webinars, conferences, and more.",
              link: {
                text: "Subscribe to the calendar",
                href: "/community/events",
              },
            },
          ],
        },
        {
          style: { height: 216 },
          cards: [
            {
              icon: <ReportBugsIcon fill="#fff" />,
              title: "Report bugs",
              content:
                "If you find any bugs in Cloudberry Database's core, please submit them on GitHub. More eyes result in fewer bugs.",
              link: {
                text: "File an issue on GitHub",
                href: "https://github.com/cloudberrydb/cloudberrydb/issues",
              },
            },
            {
              icon: <ForDevIcon fill="#fff" />,
              title: "Share new ideas / Make feature requests",
              content:
                "Share your ideas and request new features on GitHub Discussions to help shape the future of the Cloudberry Database.",
              link: {
                text: "Share your ideas",
                href: "https://github.com/orgs/cloudberrydb/discussions/new?category=ideas-feature-requests",
              },
            },
            {
              icon: <ShareNewIdeasIcon fill="#fff" />,
              title: "For developers",
              content:
                "Join the group of contributors, where both new and experienced individuals are welcome to contribute their unique skills and perspectives.",
              link: {
                text: "See the contribution guide",
                href: "/contribute",
              },
            },
          ],
        },
      ],
    },
    {
      title: "Get Support",
      cardLines: [
        {
          style: { height: 182, gridTemplateColumns: "1fr 1fr" },
          cards: [
            {
              style: { width: 474 },
              title: "Documentation",
              content:
                "The knowledge base is where you can find most of the usage and troubleshooting in the Cloudberry Database.",
              link: { text: "View the doc", href: "/docs" },
            },
            {
              style: { width: 474 },
              title: "Q&A",
              content:
                "Ask for help on GitHub Discussions when running or developing Cloudberry Database. We're always here to assist you.",
              link: {
                text: "Ask for help",
                href: "https://github.com/orgs/cloudberrydb/discussions/categories/q-a",
              },
            },
          ],
        },
      ],
    },
    {
      title: "Stay Informed",
      cardLines: [
        {
          style: { height: 195, gridTemplateColumns: "1fr 1fr" },
          cards: [
            {
              style: { width: 474 },
              title: "Blog",
              content:
                "The Blog contains regular blog posts from the team and the community, including the monthly newsletter, release posts, internal technologies, events, and announcements.",
              link: { text: "Read the latest", href: "/blog" },
            },
            {
              title: "Twitter",
              style: { width: 474 },
              content:
                'For news and updates, follow @cloudberrydb on Twitter("X" now).',
              link: {
                text: "Follow us",
                href: "https://twitter.com/cloudberrydb",
              },
            },
          ],
        },
        {
          style: { height: 176 },
          cards: [
            {
              title: "Announcements",
              content:
                "News and updates from the team on the GitHub Discussions channel.",
              link: {
                text: "Stay informed with news",
                href: "https://github.com/orgs/cloudberrydb/discussions/categories/announcements",
              },
            },
            {
              title: "WeChat Official Account",
              content: "The Mandarin Chinese blog channel.",
              link: { text: "Follow us", href: "/community/wechat" },
            },
            {
              title: "Youtube",
              content:
                "Get notified about the latest videos by subscribing to the CloudberryDB channel.",
              link: {
                text: "Watch now",
                href: "https://youtube.com/@cloudberrydb",
              },
            },
          ],
        },
      ],
    },
    {
      title: "Guidelines and Policy",
      cardLines: [
        {
          style: { height: 182 },
          cards: [
            {
              title: "Code of Conduct",
              content:
                "Work together to create an open, welcoming, diverse, inclusive, and healthy space for everyone.",
              link: { text: "Learn more", href: "/community/coc" },
            },
            {
              title: "Brand Guidelines",
              content:
                "The comprehensive guide on how to download and use our logos, names, and fonts.",
              link: {
                text: "Discover the guideline",
                href: "/community/brand",
              },
            },
            {
              title: "Security Policy",
              content:
                "View the security policy to learn how to report security issues to us.",
              link: {
                text: "Learn the security policy",
                href: "/community/security",
              },
            },
          ],
        },
      ],
    },
  ],
};

// zh language
if (isZhLangrage()) {
  COMMUNITY_PAGE = {
    headerCard: {
      titleText: "因你而社区。现在加入我们吧。",
      subText:
        "Cloudberry Database 由一群数据库专家负责维护。我们相信开源和社区的力量。社区参与形式多样，由你来探索；保持追踪，获取最新社区动态。",
    },
    cardWraps: [
      {
        title: "参与进来",
        cardLines: [
          {
            style: { height: 216 },
            cards: [
              {
                icon: <SlackIcon fill="#fff" />,
                title: "Slack",
                content:
                  "Slack 是全球社区成员实时交流互动平台，敬请阅读《Slack 使用指南》了解详情。",
                link: { text: "参与互动", href: "/community/slack" },
              },
              {
                icon: <WechatIcon fill="#fff" />,
                title: "微信群",
                content:
                  "中文用户可请求加入微信交流群，参与日常聊天和社区讨论。",
                link: {
                  text: "加入微信群",
                  href: "/community/wechat",
                },
              },
              {
                icon: <EventsIcon fill="#fff" />,
                title: "活动",
                content:
                  "订阅活动日历，追踪更多社区活动，如 Meetup、网络研讨会、会议等。",
                link: {
                  text: "订阅日历",
                  href: "/community/events",
                },
              },
            ],
          },
          {
            style: { height: 216 },
            cards: [
              {
                icon: <ReportBugsIcon fill="#fff" />,
                title: "反馈问题",
                content:
                  "如发现 Cloudberry Database 内核中的任何问题，欢迎在 GitHub 上提交 Issue 反馈。只要眼睛多，Bug 无处躲。",
                link: {
                  text: "在 GitHub 上报告 Issue",
                  href: "https://github.com/cloudberrydb/cloudberrydb/issues",
                },
              },
              {
                icon: <ForDevIcon fill="#fff" />,
                title: "分享点子 / 提功能需求",
                content:
                  "在 GitHub Discussions 上分享你的好想法、提出新的功能需求，共同塑造 Cloudberry Database 的良好体验。",
                link: {
                  text: "分享点子",
                  href: "https://github.com/orgs/cloudberrydb/discussions/new?category=ideas-feature-requests",
                },
              },
              {
                icon: <ShareNewIdeasIcon fill="#fff" />,
                title: "开发者：参与贡献",
                content:
                  "加入贡献者团队，无论富有经验还是新人，都希望你在这里发挥你的特长和能力。",
                link: {
                  text: "查看贡献指南",
                  href: "/contribute",
                },
              },
            ],
          },
        ],
      },
      {
        title: "获取帮助",
        cardLines: [
          {
            style: { height: 182 },
            cards: [
              {
                style: { width: 474 },
                title: "项目文档",
                content:
                  "项目文档是一个知识库，Cloudberry Database 大部分的用法和故障排除方法都能从这里找到答案。",
                link: { text: "查看文档", href: "/docs" },
              },
              {
                style: { width: 474 },
                title: "Q&A 问答",
                content:
                  "在运行或开发 Cloudberry Database 时遇到问题，你可以在 GitHub Discussions 上发帖请求帮助。",
                link: {
                  text: "请求帮助",
                  href: "https://github.com/orgs/cloudberrydb/discussions/categories/q-a",
                },
              },
            ],
          },
        ],
      },
      {
        title: "追踪动态",
        cardLines: [
          {
            style: { height: 195 },
            cards: [
              {
                style: { width: 474 },
                title: "博客",
                content:
                  "博客频道包含团队和社区的定期博客文章，如社区月报、版本新闻、原理详解、活动通知等。",
                link: { text: "阅读最新文章", href: "/blog" },
              },
              {
                title: "Twitter",
                style: { width: 474 },
                content:
                  '欢迎关注我们的 X（原 Twitter）帐号 @cloudberrydb，获取新闻和动态。',
                link: {
                  text: "关注我们",
                  href: "https://twitter.com/cloudberrydb",
                },
              },
            ],
          },
          {
            style: { height: 176 },
            cards: [
              {
                title: "官方通告",
                content:
                  "我们在 GitHub Discussions 通告频道发布团队和产品相关的动态与更新。",
                link: {
                  text: "保持追踪",
                  href: "https://github.com/orgs/cloudberrydb/discussions/categories/announcements",
                },
              },
              {
                title: "微信公众号",
                content: "中文博客和新闻通告发布渠道。",
                link: { text: "扫码关注", href: "/community/wechat" },
              },
              {
                title: "Youtube",
                content:
                  "欢迎订阅 CloudberryDB Youtube 频道，第一时间查看我们发布的视频。",
                link: {
                  text: "现在观看",
                  href: "https://youtube.com/@cloudberrydb",
                },
              },
            ],
          },
        ],
      },
      {
        title: "指南与策略",
        cardLines: [
          {
            style: { height: 182 },
            cards: [
              {
                title: "社区成员守则",
                content:
                  "共同努力，为每个社区成员构建一个开放、友好、多样化、包容和健康的空间。",
                link: { text: "了解详情", href: "/community/coc" },
              },
              {
                title: "品牌指南",
                content:
                  "介绍如何下载、规范使用项目标志、名称和字体。",
                link: {
                  text: "查看指南",
                  href: "/community/brand",
                },
              },
              {
                title: "安全策略",
                content:
                  "查看安全策略了解如何向官方报告安全问题。",
                link: {
                  text: "了解安全策略",
                  href: "/community/security",
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

let LINK_NAV_CONFIG = COMMUNITY_PAGE.cardWraps.map((item) => {
  return {
    label: item.title,
    id: formatStrHorizontalLine(item.title),
  };
});

export { COMMUNITY_PAGE, LINK_NAV_CONFIG };
