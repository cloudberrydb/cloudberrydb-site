---
title: 使用 Git & GitHub
description: 在开始贡献之前，了解 Git 和 GitHub 可以帮你更高效地做出贡献，以及与其他成员保持高效沟通。
---

Cloudberry Database 项目托管在 GitHub 上。我们使用 GitHub Issues 作为 Bug 报告系统，使用 GitHub Discussions 进行讨论并获取反馈，使用 Git 作为我们的版本控制系统。鉴于此，对于社区用户和开发人员来说，学会如何更好地使用 GitHub 和 Git 非常重要。

请注意，我们的目的不是在此页面上呈现一个完整的 Git 或 GitHub 指南，只是列出了你在未来工作中会用到的关键内容。

## 前期准备

### 步骤 1：设置你的 GitHub.com 帐号

在开始所有工作之前，必须有一个 GitHub 帐户。如果没有，请创建一个。

然后，你需要编辑你的 GitHub 个人资料，包括你的姓名、头像、简介、社交帐户等，以便让其他人了解你。

### 步骤 2：配置双重身份验证

目前只有 Cloudberry Database 组织成员（包括 Committer 和 PMC 成员）才需要配置双重身份验证。如果你是非 Cloudberry Database 组织贡献者，可以跳过此步骤。

你可以参考[《GitHub 文档：配置双重身份验证》](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)。

### 步骤 3：安装 Git

如果你没有安装 Git，可以在 [www.git-scm.com](http://www.git-scm.com/) 下载 Git。

如果你在安装 Git 时需要额外帮助，可以在 [ProGit 网站 - Git 安装](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git) 相关章节中找到更多信息。

### 步骤 4：设置 Git 用户名和邮箱

在终端运行下述命令来设置你的邮箱地址和用户名，这些信息会显示在你的提交中：

```
git config --global user.email "Your Email"
git config --global user.name "Your Name"
```

:::caution

如果你习惯在不同的笔记本电脑上工作，请确保你的 Git 配置相同的邮箱和用户名，以防我们的 CLABot 检测不到你的贡献者信息。

:::

### 步骤 5：设置文本编辑器

执行下面命令设置你的常用编辑器（假设为 Vim），设置后 Git 默认使用该编辑器打开和编辑文件：

```
git config --global core.editor "vim"
```

如果你想将编辑器设置成其他类型，如 `Visual Studio Code`、`Sublime Text` 或 `TextMate`，可参考 [GitHub 文档](https://docs.github.com/en/get-started/getting-started-with-git/associating-text-editors-with-git?platform=mac)。

### 步骤 6：了解 GitHub 工作流

请跟着 [GitHub 官方文档](https://docs.github.com/en/get-started/quickstart/github-flow) 学习如何创建分支、进行更改、创建 Pull Request、处理评审留言以及合并 Pull Request。

## 变更提交规范

我们制作了一份 [`git commit` 信息模板](https://raw.githubusercontent.com/cloudberrydb/cloudberrydb/main/.gitmessage)，你可以下载该文件，并运行下述命令以使其全局生效：

```
git config --global commit.template .gitmessage
```

我们在上面的模板中都给出了重要说明。如果你想进一步了解如何编写一个好的提交信息，可以阅读该篇博文：[https://cbea.ms/git-commit/](https://cbea.ms/git-commit/) 。

:::caution

一旦应用提交信息模板后，请使用命令 `git commit` 而不是 `git commit -m "CommitMessage..."` 来提交更改，后者只支持编辑信息标题而无法编辑信息正文。

:::

如果你需要重写提交信息，请使用 `git commit --amend` 命令，详情可参考 [GitHub 文档](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message)，但该命令不支持我们的自定义信息模板。

## GitHub 标签系统

:::info

现在，只有具有分配 issue 或仓库写入权限的成员才能添加或编辑标签。GitHub Discussions 和 GitHub Issues 使用了相同的标签系统。

:::

<table>
<thead>
<tr>
<th>优先级</th>
<th>类型</th>
<th>状态</th>
<th>标准</th>
</tr>
</thead>
<thead>
<tr>
<th><small>Issue 或 PR 的紧急程度</small></th>
<th><small>Issue 或 PR 的类型</small></th>
<th><small>Issue 或 PR 的进度</small></th>
<th><small>大多数项目常用的标签</small></th>
</tr>
</thead>
<tbody>
<tr>
<td>
<p><font color="#e11d21">priority: Urgent</font></p>
<p><font color="#eb6420">priority: High</font></p>
<p><font color="#fbca04">priority: Medium</font></p>
<p><font color="#009800">priority: Low</font></p>
</td>
<td>
<p><font color="#9F2F92">type: Announcement</font></p>
<p><font color="#7249B1">type: Proposal</font></p>
<p><font color="#a2eeef">type: Enhancement</font></p>
<p><font color="#d876e3">type: Question</font></p>
<p><font color="#0075ca">type: Documentation</font></p>
<p><font color="#e11d21">type: Bug</font></p>
<p><font color="#9FC06D">type: Refactoring</font></p>
<p><font color="#0ADB95">type: Testing</font></p>
<p><font color="#E99695">type: Security</font></p>
<p><font color="#C81E1F">type: Backport</font></p>
<p><font color="#32A62D">type: Pipeline</font></p>
</td>
<td>
<p><font color="#e99695">status: Await triage</font></p>
<p><font color="#0E8A16">status: In Progress</font></p>
<p><font color="#000000">status: Not planned</font></p>
<p><font color="#18B59A">status: Completed</font></p>
</td>
<td>
<p><font color="#008672">help wanted</font></p>
<p><font color="#7057ff">good first issue</font></p>
</td>
</tr>
</tbody>
</table>

**标签说明：**

```
#紧急程度
    priority: Urgent - 需要尽快处理解决。不修复该 issue 会发生严重错误。
    priority: High - 严重 issue 修复后，就该着手优先处理该类 issue。
    priority: Medium - 该类 issue 可能比较有用，需要多加关注。
    priority: Low - 任何人都可以处理该类 issue，可以作为贡献者入门级问题。

#类型
    type: Announcement - 新版本发布、活动、博文等
    type: Proposal - 涉及 Cloudberry Database 重要变更的提案
    type: Enhancement - 新功能，新需求，新点子
    type: Question - 请求社区帮忙
    type: Documentation - 文档类改进或变更
    type: Bug - 出现问题，影响使用
    type: Refactoring - 代码重构
    type: Testing - 添加、修改或更新测试
    type: Security - 漏洞披露或修复安全问题
    type: Backport - 与旧版本兼容的相关问题或 PR
    type: Pipeline - CICD 工作流

#状态
    status: Await triage - 该 issue 需要进行分类分级。
    status: In Progress - 正在处理该 issue，已有人认领。
    status: Not planned - 包括重复、无效或无计划修复的问题。
    status: Completed - 该标签意味着问题已被解决、关闭、修复或解决。

#标准
    help wanted - 需要额外关注
    good first issue - 适合初学者、入门新手
```

如果你要新建标签，请遵循标签格式 `前缀名: 标签名称`。

## GitHub Issues 还是 GitHub Discussions

我们使用 GitHub Issues 用作 bug 报告和工作追踪系统，使用 GitHub Discussions 进行日常问答、分享好点子、提交功能需求以及分享 Cloudberry Database 提案。 

如果你发现 Cloudberry Database 内核相关的问题，请在 [GitHub Issues](https://github.com/cloudberrydb/cloudberrydb/issues/new/choose) 报告。

如果你要请求帮助、回答问题，或分享功能点子，或获取自己提案的反馈，请在 GitHub Discussions [发布新帖子](https://github.com/orgs/cloudberrydb/discussions/new/choose)。

| GitHub Discussion 板块       | 描述                                      |
|------------------------------|-------------------------------------------|
| Announcements                | 新版本发布、活动、博文等（仅版主可发布）  |
| Ideas / Feature Requests     | 分享好点子，提交新需求                    |
| Proposal                     | 分享针对 Cloudberry Database 的重大变更提案|
| Q&A                          | 请求社区帮助                               |

:::note

敬请阅读 GitHub 博文 [《What is GitHub Discussions? A complete guide》](https://resources.github.com/devops/process/planning/discussions/) 了解更多内容。

:::

## GitHub Projects 项目管理

当前，我们的项目管理看板仅针对 Cloudberry Database 组织成员开放。如果你是 Cloudberry Database 成员，可在浏览器中访问 [https://github.com/orgs/cloudberrydb/projects/5](https://github.com/orgs/cloudberrydb/projects/5)。下面是项目看板字段信息，以供参考。

<table>
<thead>
<tr>
<th>状态</th>
<th>优先级</th>
<th>大小</th>
<th>故事类型</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<p>🧊 Icebox</p>
<p>📋 Backlog</p>
<p>🏗 In progress</p>
<p>👀 In review</p>
<p>✅ Done</p>
</td>
<td>
<p>🌋 Urgent</p>
<p>🏔 High</p>
<p>🏕 Medium</p>
<p>🏝 Low</p>
</td>
<td>
<p>🐋 X-Large</p>
<p>🦑 Large</p>
<p>🐂 Medium</p>
<p>🐇 Small</p>
<p>🦔 Tiny</p>
</td>
<td>
<p>🤩 Feature</p>
<p>🥳 Chore</p>
<p>🐛 Bug</p>
<p>🚀️ Release</p>
</td>
</tr>
</tbody>
</table>

## GitHub 高级用法

除了在 GitHub 中使用纯文本以及[基本写作和格式语法](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)外，你还可以在 GitHub Pull Request、issue 和评论中采用更多格式来让交流更清晰，如[表格](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)、[流程图](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)、[任务列表](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists)等等，详情可参阅 [GitHub 文档](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting)。

## 缩略语

我们经常在代码评审以及 GitHub 互动中使用一些缩写词，来提升沟通效率。下面收集了一些常用缩写词，可以帮助你在 Cloudberry Database 社区及其他开源项目中与其他社区成员高效互动。

| ****    |                                 | ****  |                                         |
|---------|---------------------------------|-------|-----------------------------------------|
| +1/++1  | Yes, agreed, accepted, approved | -1    | No, rejected, disagreed                 |
| AFAICT  | As far as I can tell            | AKA   | Also known as                           |
| AFAIK   | As far as I know                | ASAP  | As soon as possible                     |
| ATM     | At the moment                   | BTW   | By the way                              |
| CUZ/COS | Because                         | DIY   | Do it yourself                          |
| DM      | Direct message                  | DNM   | Do not merge                            |
| DRY     | Don't repeat yourself           | FYI   | For your information                    |
| IANAL   | I am not a lawyer               | ICYMI | In case you missed it                   |
| IIRC    | If I recall correctly           | IMHO  | In my humble opinion                    |
| IMO     | In my opinion                   | ITT   | In this thread                          |
| IOW     | In other words                  | w/o   | Without                                 |
| LGTM    | Looks good to me                | LGT1  | Looks good to 1                         |
| LGT2    | Looks good to 2                 | NP    | No Problem                              |
| PLZ     | Please                          | PTAL  | Please take a look                      |
| RFC     | Request for comments            | RTFM  | Read the f*****g manual                 |
| SGTM    | Sounds good to me               | TBD   | To Be defined/done/discussed/determined |
| TBR     | To be reviewed                  | TL;DR | Too Long; Didn't Read                   |
| TYSM    | Thank you so much               | TTYL  | Talk to you later                       |
| TYVM    | Thank you very much             | WDYT  | What do you think                       |
| WIP     | Work in progress                | w/    | With                                    |

## 学习资料

- [Git 备忘录](https://training.github.com/downloads/github-git-cheat-sheet/)
- [Git 文档](https://www.git-scm.com/doc)