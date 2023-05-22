const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const branch = 'main'
const repoUrl = `https://github.com/cloudberrydb`
const twitterUrl = `https://twitter.com/cloudberrydb`
const youtubeUrl = `https://youtube.com/@cloudberrydb`
const slackUrl = 'https://communityinviter.com/apps/cloudberrydb/welcome'

const config = {
  title: 'Cloudberry Database',
  tagline: 'Open Source MPP Database',
  favicon: 'img/logo.svg',
  url: 'https://cloudberrydb.io',
  baseUrl: '/',
  organizationName: 'cloudberrydb', // Usually your GitHub org/user name.
  projectName: 'cloudberrydb-site', // Usually your repo name.

//  deploymentBranch: 'gh-pages',
//  githubHost: 'github.com',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en','zh'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
      },
      zh: {
        label: '简体中文',
        path: 'zh',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'http://github.com/cloudberrydb/cloudberrydb-site',
        },
        blog: {
          showReadingTime: false,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  scripts: [
    '/js/ribbons.js'
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      announcementBar: {
        id: 'support_us',
        content:
          'Welcome! Be patient to wait for more news on Cloudberry Database.',
        backgroundColor: '#fafbfc',
        textColor: '#ed7331',
        isCloseable: true,
      },
      navbar: {
        logo: {
          alt: 'Cloudberry Database',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
        },
        hideOnScroll: false,
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'right',
            dropdownItemsAfter: [{
                type: 'html',
                value: '<hr style="margin: 0.3rem 0;">',
            },{
              href: 'https://github.com/cloudberrydb/cloudberrydb-site/',
              label: 'Help Us Translate',
            }]
          },{
            href: repoUrl,
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
        }, {
            href: twitterUrl,
            position: 'right',
            className: 'header-twitter-link',
            'aria-label': '@cloudberrydb on Twitter',
        }, {
            href: youtubeUrl,
            position: 'right',
            className: 'header-youtube-link',
            'aria-label': '@cloudberrydb on YouTube',
        },{
          href: slackUrl,
          position: 'right',
          className: 'header-slack-link',
          'aria-label': '@cloudberrydb on Slack',
      },
        ],
        },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/cbdb-overview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/cloudberrydb',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/cloudberrydb',
              },
              {
                label: 'Slack',
                href: 'https://communityinviter.com/apps/cloudberrydb/welcome',
              },
              {
                label: 'Youtube',
                href: 'https://youtube.com/@cloudberrydb',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HashData Technology Limited. or its affiliates. All Rights Reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
