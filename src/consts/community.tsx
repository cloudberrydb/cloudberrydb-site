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
          style: { height: 182 },
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
          style: { height: 195 },
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
            style: { height: 182 },
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
            style: { height: 195 },
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
}

let LINK_NAV_CONFIG = COMMUNITY_PAGE.cardWraps.map((item) => {
  return {
    label: item.title,
    id: formatStrHorizontalLine(item.title),
  };
});

export { COMMUNITY_PAGE, LINK_NAV_CONFIG };
