const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const branch = 'main'
const repoUrl = `https://github.com/cloudberrydb`
const twitterUrl = `https://twitter.com/cloudberrydb`
const youtubeUrl = `https://youtube.com/@cloudberrydb`
const slackUrl = 'https://communityinviter.com/apps/cloudberrydb/welcome'

const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeConfigs: {
      en: {
        label: 'English',
      },
    },
  },
  title: 'Cloudberry Database',
  tagline: 'Next Generation Unified Database for Analytics and AI',
  favicon: '/img/favicon.ico',
  url: 'https://cloudberrydb.org',
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
            'https://github.com/cloudberrydb/cloudberrydb-site/edit/main/',
            editLocalizedFiles: true,
        },
        blog: {
          showReadingTime: false,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-5RF5B25JHD',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  scripts: [
    '/js/ribbons.js',
    'http://js.hs-scripts.com/39864506.js',
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      announcementBar: {
        id: 'support_us',
        content:
          '<a href="https://github.com/cloudberrydb/cloudberrydb" target="_blank">🎉️🎉️Cloudberry Database is open sourced now!</a>',
        backgroundColor: '#fafbfc',
        textColor: '#ed7331',
        isCloseable: true,
      },
      navbar: {
        logo: {
          alt: 'Cloudberry Database',
          src: '/img/cloudberrydb_color_black.svg',
          srcDark: '/img/cloudberrydb_color_white.svg',
        },
        hideOnScroll: false,
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsbars',
            position: 'left',
            label: 'Docs',
          },
          {
            label: 'Community',
            position: 'left',
            items: [
              {
                label: 'Slack Guide',
                to: '/community/slack',
              },
              {
                label: 'WeChat Guide',
                to: '/community/wechat',
              },
              {
                label: 'Events',
                to: '/community/events',
              },
              {
                label: 'Security Policy',
                to: '/community/security',
              },
              {
                label: 'Brand Guidelines',
                to: '/community/brand',
              },
              {
                label: 'Code of Conduct',
                to: '/community/coc',
              }
            ],
          },
          {
            label: 'Contribute',
            position: 'left',
            items: [
              {
                label: 'How to Contribute',
                to: '/contribute/how-to-contribute',
              },
              {
                label: 'Working with Git & GitHub',
                to: '/contribute/git',
              },
              {
                label: 'Code Contribution',
                to: '/contribute/code',
              },
              {
                label: 'Proposal Guide',
                to: '/contribute/proposal',
              },
              {
                label: 'Document Contribution',
                to: '/contribute/doc',
              }
            ],
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/download', label: 'Download', position: 'left'},
          {to: '/support', label: 'Support', position: 'left'},
	        {to: '/bootcamp', label: 'Bootcamp', position: 'left'},
 {
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
        logo: {
          alt: 'Cloudberry Database Logo',
          src: '/img/cloudberrydb_color_white.svg'
        },
        copyright: `Copyright © ${new Date().getFullYear()} HashData Technology Limited.`,
        links: [
            {
              title: 'Support',
              items: [
                {
                  label: 'GitHub Issues',
                  href: 'https://github.com/cloudberrydb/cloudberrydb/issues',
                },
                {
                  label: 'GitHub Discussions',
                  href: 'https://github.com/orgs/cloudberrydb/discussions',
                },
                {
                  label: 'Slack',
                  href: 'https://communityinviter.com/apps/cloudberrydb/welcome',
                },
                {
                  label: 'Twitter',
                  href: 'https://twitter.com/cloudberrydb',
                },
                {
                  label: 'Youtube',
                  href: 'https://youtube.com/@cloudberrydb',
                },
                {
                  label: 'Security',
                  to: '/community/security',
                },
              ],
            },
            {
              title: 'Resources',
              items: [
                {
                  label: 'Download',
                  to: '/download',
                },
                {
                  label: 'Documentation',
                  to: '/docs/',
                },
                {
                  label: 'Events',
                  to: '/community/events',
                },
                {
                  label: 'Code of Conduct',
                  href: '/community/coc',
                },
                {
                  label: 'Brand Guidelines',
                  href: '/community/brand',
                },
              ],
            },
            {
              title: 'Contribution',
              items: [
                {
                  label: 'Working with Git & GitHub',
                  to: 'contribute/git',
                },
                {
                  label: 'Contribution Overview',
                  to: '/contribute/how-to-contribute',
                },
                {
                  label: 'Code Contribution',
                  to: 'contribute/code',
                },
                {
                  label: 'Doc Contribution',
                  to: 'contribute/doc',
                },
              ],
            },
          ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  };

module.exports = config;
