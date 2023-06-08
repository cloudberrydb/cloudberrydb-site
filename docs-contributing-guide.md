# CloudberryDB Documentation Contribution Guide

## Code of conduct

We are committed to fostering a welcoming and respectful community. All contributors are expected to adhere to our [Code of Conduct](https://cloudberrydb.io/community/coc).

## What contributors can do

Contributors can help improve the CloudberryDB documentation in the following ways:

- Fix typos, wrong spelling, grammar mistakes, and broken links
- Correct inaccurate or misleading descriptions
- Translate a document that is currently in one language only.
- Add new chapters or sections based on their experience with the product
- Improve the clarity and comprehensibility of existing content

## Important files

Here are some of the key files in our documentation repository:

- `docs/`: This directory contains the English documentation.
- `i18n/zh/docusaurus-plugin-content-docs/current/`: This directory contains the Chinese documentation.

## How to contribute

### For simple updates

For simple updates such as typo or link fixing in a single document:

1. Navigate to the target page on the [Cloudberry Database documentation site](https://cloudberrydb.io/docs/cbdb-overview) you wish to update.
2. Click **Edit this page** or **编辑此页** at the left bottom of the page. This will take you to the GitHub edit page for that file.
3. Make your changes in the GitHub editor.
4. Scroll down to the **Propose changes** section. Enter a short description of your changes in the first field, and a more detailed description in the second field.
5. Click **Propose changes** to create a pull request.

### For more complex updates or new content

For more complex updates or adding new content in multiple documents:

1. Fork the [CloudberryDB documentation repository](https://github.com/cloudberrydb/cloudberrydb-site).
2. Clone your forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes in your local environment.
5. Commit your changes and push them to your forked repository.
6. Navigate to the original CloudberryDB documentation repository.
7. Click **New pull request**.
8. Choose your forked repository's branch in the comparison, and choose the `main` branch for the `cloudberrydb/cloudberrydb-site` repository.
9. Enter a clear and concise title for your pull request. In the description, explain the purpose of your changes.
10. Click **Create pull request**.

## Styling

Our documentation is written in Markdown. Follow these [Markdown rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) when contributing content. Our website uses the Docusaurus framework. For additional styling options, you can refer to the [Docusaurus Markdown features](https://docusaurus.io/docs/markdown-features).

### Simple writing tips

We aim for a clear, concise, and friendly writing style in our documentation. Here are some guidelines:

- Use active voice whenever possible.
- Keep sentences and paragraphs short and to the point.
- Avoid jargon and technical terms when possible. When you must use them, provide definitions or links to more information.
- Use examples to illustrate complex concepts or procedures.

For more details about writing styles, you can read:

- [Google developer documentation style guide](https://developers.google.com/style)
- [中文技术文档写作风格指南](https://zh-style-guide.readthedocs.io/zh_CN/latest/)

## PR Review Process

After you submit your PR, it will be reviewed by the CloudberryDB team. We aim to review PRs within a week of submission, but it might take longer depending on the complexity of the changes. We appreciate your patience during this process.

Please keep an eye on your PR after submission. You might receive feedback or questions in the PR comments. Addressing these comments promptly will help speed up the review process.

## Process for major changes

If you are considering a major change to the documentation, such as adding a new section or rewriting a large part of it, we recommend the following process:

1. Open an issue in the [CloudberryDB documentation repository](https://github.com/cloudberrydb/cloudberrydb-site) describing your proposed changes. This allows the CloudberryDB team and community to provide feedback before you invest a lot of time in writing.
2. Once you have received feedback and agreement on your proposal, follow the contribution process described above to implement your changes and submit a pull request.
