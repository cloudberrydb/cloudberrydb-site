---
title: 文档贡献指南
description: 我们非常感谢你对我们文档（包括网站和其他相关资料）所做的贡献。
---

## 社区行为准则

我们致力于打造一个友好且尊重他人的社区。我们期待所有贡献者都能遵守我们的[社区行为准则](../community/coc)。

## 贡献者可以做什么

贡献者可以通过以下方式帮助改进 Cloudberry Database 文档：

- 纠正拼写错误、语法错误和损坏的链接
- 纠正不准确或误导性的描述
- 翻译目前只有一种语言显示的文档（如将英文翻译成中文，或将中文翻译成英文）
- 基于对产品的体验添加新的章节或段落
- 提高现有内容的清晰度和可理解性

## 重要文件

以下是我们文档仓库中的一些关键文件：

- `docs/`：此目录包含英文文档。
- `i18n/zh/docusaurus-plugin-content-docs/current/`：此目录包含中文文档。

## 如何贡献

:::info

本指南假定你已经熟悉 Git 流程，包括如何使用 Git 命令或 GitHub Desktop 创建 Pull Request。

:::

### 简单更新

如果你想对单个文档进行简单的更新，例如纠正错别字或修复链接，请按照以下步骤操作：

1. 前往 [Cloudberry Database 文档网站](https://cloudberrydb.io/docs/) 上你想要更新的目标页面。
2. 点击页面左下角的 **“编辑此页”**，你将进入该文件的 GitHub 编辑页面。
3. 在 GitHub 编辑器中进行更改。
4. 向下滚动到 **Propose changes** 部分，在第一个字段中输入对更改的简短说明，在第二个字段中输入更详细的说明。
5. 点击 **Propose changes** 创建一个 Pull Request。
6. 按照 CLAassistant 的提示签署贡献者许可协议。

### 复杂更新或添加新内容

针对多个文档中的更复杂更新或添加新内容：

1. 将 [Cloudberry Database 网站仓库](https://github.com/cloudberrydb/cloudberrydb-site) fork 到个人帐号下。
2. 将你 fork 的仓库克隆到本地环境。
3. 为你的更改创建新分支。
4. 在本地环境中进行更改。
5. 提交更改，并将其推送到你的存储仓库。
6. 前往原先的 Cloudberry Database 网站仓库。
7. 根据提示，点击新建新的 Pull Request。
8. 比较个人分支，然后选择要提交到的 `cloudberrydb/cloudberrydb-site` 仓库的 `main` 分支。
9. 为 Pull Request 输入清晰简洁的标题。在描述中，解释你更改的目的。
10. 点击 **Create pull request** 按钮创建 Pull Request。
11. 按照 CLAassistant 的提示，签署贡献者许可协议。

## 样式风格

我们的文档使用 Markdown 编写。在贡献内容时，请遵循这些 [Markdown 规则](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)。我们的网站使用 Docusaurus 框架。对于额外的样式选项，你可以参考 [Docusaurus Markdown 功能](https://docusaurus.io/docs/markdown-features)。

### 简明写作提示

我们的文档旨在采用清晰、简洁和友好的写作风格。以下是一些指导原则：

- 尽可能使用主动语态。
- 句子和段落保持简短明了。
- 尽可能避免使用术语和技术用语。当你必须使用它们时，请提供定义或链接以提供更多信息。
- 使用示例来说明复杂的概念或程序。
  
要了解更多写作风格信息，可以阅读：

- [Google 开发者文档风格指南](https://developers.google.com/style)

## PR 审核流程

在你提交 PR 后，Cloudberry Database 团队会对其进行审核。我们目标是在提交一周内完成 PR 审核，但还需要根据更改的复杂性决定，有可能需要更长的时间。我们感谢你在此过程中保持耐心。

提交 PR 后，请保持密切关注。你可能会在 PR 评论中收到反馈或问题。及时回应这些评论将有助于加快审核流程。

## 提议文档变更的流程

如果你正考虑对文档进行较大更改，例如添加新段落或重写大部分内容，我们建议你遵循以下流程：

1. 在 [Cloudberry Database 网站仓库](https://github.com/cloudberrydb/cloudberrydb-site)新建一条 issue，描述你提议的更改。这可以让 Cloudberry Database 团队和社区在你投入大量时间编写之前提供反馈。
2. 一旦你收到对你提议的反馈和批准，请遵循上面描述的贡献流程来实现你的更改并提交 Pull Request。