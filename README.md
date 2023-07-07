## Cloudberry Database Website & Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/6f2dcedf-68eb-479e-9cf6-5c788d173572/deploy-status)](https://app.netlify.com/sites/cloudberrydb/deploys)
[![Slack](https://img.shields.io/badge/Join_Slack-6a32c9)](https://communityinviter.com/apps/cloudberrydb/welcome)
[![Twitter Follow](https://img.shields.io/twitter/follow/cloudberrydb)](https://twitter.com/cloudberrydb)
[![Website](https://img.shields.io/badge/Visit%20Website-eebc46)](https://cloudberrydb.org)
[![GitHub 
Discussions](https://img.shields.io/github/discussions/cloudberrydb/cloudberrydb)](https://github.com/orgs/cloudberrydb/discussions)

---------

## Website Directory Structure

```
.
├── README.md
├── babel.config.js
├── blog
├── docs
├── docusaurus.config.js
├── i18n
├── LICENSE
├── sidebars.js
├── src
│ ├── components
│ ├── css
│ ├── pages
│ │ ├── community
│ ├── theme
│ │ ├── Footer
├── static
│ ├── img
│ ├── js
```

Notable directories Description:

1. Blog

    The Blog post files are placed in the `blog` directory. You need
    to create one new folder for each new post and add the author
    information to the `blog/authors.yml`.

2. Document

    The latest version of the document is under the `docs` (en) and `/i18n/zh/docusaurus-plugin-content-docs/current/` (zh).
    directory. Media including images, video can be placed in
    `docs/media` folder. You must add the new doc file name to
    `sidebars.js` to make it display on the website.

3. Pictures

   All images are placed in the `static/images` directory.

## Website Building

This website is built using [Docusaurus 2](https://docusaurus.io/), a
modern static website generator. If you don't know Docusaurus, please
learn more from [Docusaurus website](https://docusaurus.io/).

You can follow these steps to install and build the Cloudberry
Database website in your local environment.

1. Clone website source

```
$ git clone https://github.com/cloudberrydb/cloudberrydb-site.git
```

2. Install dependencies

Before building the website, you need to install dependencies to make
sure no errors when building.

```
$ npm install
```

3. Build and run

```
$ npm run build 
$ npm run serve
```

This command generates static content into the `build` directory and
can be served using any static contents hosting service.

If you are using GitHub pages for hosting, this command is a
convenient way to build the website and push to the `gh-pages` branch.

Then you can visit `localhost:3000` in the browser.

4. (Option)If you want to run the local development environment,
   please run:

```
$ npm run start
```

This command starts a local development server and opens up a browser
window. Most changes are reflected live without having to restart the
server.

## Document Contribution

Our documents are still in construction, welcome to help. If you're
interested in [document
contribution](https://cloudberrydb.org/community/docs-contributing-guide),
you can submit the pull request
[here](https://github.com/cloudberrydb/cloudberrydb-site/tree/main/docs).

# License

Apache License Version 2.0(see LICENSE & NOTICE).
