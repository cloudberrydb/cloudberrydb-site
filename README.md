[![Netlify Status](https://api.netlify.com/api/v1/badges/6f2dcedf-68eb-479e-9cf6-5c788d173572/deploy-status)](https://app.netlify.com/sites/cloudberrydb/deploys)

# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator. If you don't know Docusaurus, please learn more from [Docusaurus website](https://docusaurus.io/).

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

# License

Apache License Version 2.0(see LICENSE & NOTICE).
