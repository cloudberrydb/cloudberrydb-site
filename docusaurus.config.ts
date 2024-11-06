import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
const config: Config = {
  title: "Cloudberry Database",
  tagline: "Open Source Alternative to Greenplum Database. Next Generation Unified Database for Analytics and AI.",
  favicon: "/img/favicon.ico",
  url: "https://cloudberrydb.org",
  baseUrl: "/",
  organizationName: "cloudberrydb", // Usually your GitHub org/user name.
  projectName: "cloudberrydb-site", // Usually your repo name.

  // onBrokenLinks: "throw",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  
  plugins: [
    "docusaurus-plugin-sass",
    [
      "@easyops-cn/docusaurus-search-local",
      { hashed: true, indexPages: true, language: ["en", "zh"] },
    ],
  ],
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
  },

  presets: [
    [
      "classic",
      {
        pages: {
          admonitions: true,
        },
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/cloudberrydb/cloudberrydb-site/edit/main/",
          editLocalizedFiles: true,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
        blog: {
          postsPerPage: "ALL",
          path: "blog", // Path to the existing blog folder
          routeBasePath: "blog", // Route for the existing blog
          include: ["*.md", "*.mdx"], // File types to include for the existing blog

          feedOptions: {
            type: "all",
            title:
              "Cloudberry Database: Open Source Alternative to Greenplum Database. Next Generation Unified Database for Analytics and AI",
          },
        },
        theme: {
          customCss: [
            "./src/css/custom.scss",
            "./src/css/design-style.scss",
            "./src/css/design-class.scss",
          ],
        },
        gtag: {
          trackingID: "G-5RF5B25JHD",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    title: "Cloudberry Database",
    tagline: "Open Source Alternative to Greenplum Database. Next Generation Unified Database for Analytics and AI",
    favicon: "/img/favicon.ico",
    url: "https://cloudberrydb.org",
    baseUrl: "/",
    organizationName: "cloudberrydb", // Usually your GitHub org/user name.
    projectName: "cloudberrydb-site", // Usually your repo name.
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        href: "/",
        alt: "Cloudberry Database",
        src: "/img/cloudberrydb_color_black.svg",
        srcDark: "/img/cloudberrydb_color_white.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsbars",
          position: "right",
          label: "Docs",
        },
        {
          label: "Community",
          position: "right",
          to: "/community",
        },
        {
          label: "Contribute",
          position: "right",
          to: "/contribute",
        },
        { to: "/blog", label: "Blog", position: "right" },
        {
          to: "/docs/releases",
          label: "Download",
          position: "right",
        },
        {
          to: "/support",
          label: "Support",
          position: "right",
        },
        {
          label: "Resources",
          position: "right",
          items: [
            {
              label: "Roadmap",
              to: "https://github.com/orgs/cloudberrydb/discussions/369",
            },
            {
              label: "Forum",
              to: "https://github.com/orgs/cloudberrydb/discussions",
            },
            {
              label: "Bootcamp",
              to: "/bootcamp",
            },
            {
              label: "Team",
              to: "/team",
            },
          ],
        },
      ],
    },
    footer: {
      logo: {
        alt: "Cloudberry Database Logo",
        src: "/img/cloudberrydb_color_white.svg",
        srcDark: "/img/cloudberrydb_color_black.svg",
      },
      copyright: `Copyright © ${new Date().getFullYear()} HashData Technology Limited.`,
      links: [
        {
          title: "Support",
          items: [
            {
              label: "GitHub Issues",
              href: "https://github.com/cloudberrydb/cloudberrydb/issues",
            },
            {
              label: "GitHub Discussions",
              href: "https://github.com/orgs/cloudberrydb/discussions",
            },
            {
              label: "Slack",
              href: "https://communityinviter.com/apps/cloudberrydb/welcome",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/cloudberrydb",
            },
            {
              label: "Youtube",
              href: "https://youtube.com/@cloudberrydb",
            },
            {
              label: "Security",
              to: "/community/security",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Download",
              href: "https://github.com/cloudberrydb/cloudberrydb/releases",
            },
            {
              label: "Documentation",
              to: "/docs/",
            },
            {
              label: "Events",
              to: "/community/events",
            },
            {
              label: "Code of Conduct",
              href: "/community/coc",
            },
            {
              label: "Brand Guidelines",
              href: "/community/brand",
            },
          ],
        },
        {
          title: "Contribution",
          items: [
            {
              label: "Working with Git & GitHub",
              to: "contribute/git",
            },
            {
              label: "Contribution Overview",
              to: "/contribute/how-to-contribute",
            },
            {
              label: "Code Contribution",
              to: "contribute/code",
            },
            {
              label: "Doc Contribution",
              to: "contribute/doc",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // algolia: {
    //   appId: "GHWUNOM15G",
    //   apiKey: "0dc1117a5a8d029a60ac5245da2afd91",
    //   indexName: "cloudberrydb",
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
