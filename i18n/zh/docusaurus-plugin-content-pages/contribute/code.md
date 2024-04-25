---
title: 代码贡献指南
description: 了解代码规范、贡献流程、如何审阅代码，以及贡献者检查清单。
---

## 社区行为准则

无论是用户还是贡献者，只要参与到 Cloudberry Database 中来，都有义务遵守我们的[社区行为准则](../community/coc)。

## 准备工作

在开始贡献之前，请阅读文档[《如何做出贡献》](/contribute/how-to-contribute)，并确保已掌握 [Git 和 GitHub](/contribute/git) 使用技巧。

特别是作为代码贡献新人，不要急于开始。请先熟悉 Cloudberry Database 社区，了解项目，阅读相关文档，学习代码规范，知道如何[编写提案](./proposal)等，然后从小处着手。

你可以寻找一些要修复的简单问题或要添加的小功能，例如带有[“good first issue”](https://github.com/cloudberrydb/cloudberrydb/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)和[“help wanted”](https://github.com/cloudberrydb/cloudberrydb/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)标签的 GitHub issue，这些可以帮你熟悉贡献流程，并借此认识开发团队成员。

此外，所有代码贡献者都需要签署贡献者许可协议（Contributor
License Agreement，CLA），在你提交第一个 Pull Request 时根据 CLAassistant 提示进行签名即可（首次签署成功后，后续无需重复签署）。

:::caution

如果你从 PostgreSQL 或 Greenplum Database 等上游项目中 cherry pick 某些提交，上游贡献者无需签署 CLA，此时忽略 CLAassistant 的警告即可，该警告提示不对你的 Pull Request 合并产生实质影响。

:::

:::warning

此外，请不要更改（删除）代码文件中的原始版权信息和开源许可证文件头。如果你对文件做了大范围修改，则可以在原许可证文件头之后添加版权信息。

不要引入遵循 GPLv2/3 或其他非 OSI 许可证的组件，引入此类许可组件会干扰 Cloudberry Database 现在使用的 Apache 许可证。如果你对此不太确定，请联系 info@cloudberrydb.org。

:::

为避免重复工作，请在开始开发重要功能之前查看已有 [Cloudberry Database 提案](./proposal)或直接在我们的 Slack 或微信群等渠道进行沟通。

## 代码规范

提交至 Cloudberry Database 的所有代码都应该遵循 [PostgreSQL 代码规范](https://www.postgresql.org/docs/current/source.html)。

### 代码格式

主要包括遵循 [PostgreSQL 风格](https://www.postgresql.org/docs/current/source-format.html)使用制表符（4 个空格）进行源代码格式化，根据 BSD 风格设定布局规则，以及行长限制在 80 列以内。虽然 PostgreSQL 代码库中存在许多不同的风格，但我们采取“就近原则”──努力使补丁代码与上下风格保持一致（参见 [PostgreSQL 邮件列表讨论](https://www.postgresql.org/message-id/16342.1221133325%40sss.pgh.pa.us)）。

可以使用现有的编辑器配置进行 Cloudberry Database 开发，比如 [Vim](https://github.com/cloudberrydb/cloudberrydb/blob/main/src/tools/editors/vim.samples)、[Emacs](https://github.com/cloudberrydb/cloudberrydb/blob/main/src/tools/editors/emacs.samples)、[Clion](https://github.com/cloudberrydb/cloudberrydb/blob/main/src/tools/editors/clion.xml) 以及[其他编辑器](https://github.com/cloudberrydb/cloudberrydb/blob/main/.editorconfig)。

### 错误信息

错误信息风格遵循 [PostgreSQL 错误信息风格指南](https://www.postgresql.org/docs/current/error-style-guide.html)。

## 贡献流程

下面将介绍如何通过发起 `Pull Request` 向 Cloudberry Database 提交代码贡献。如果你还不太了解如何使用 Git 和 GitHub，请再次阅读我们的[使用指南](./git)。

要向 Cloudberry Database 提交贡献，请按如下步骤操作：

1. 将 [Cloudberry Database 仓库](https://github.com/cloudberrydb/cloudberrydb) Fork 到个人 GitHub 帐号下。

2. 将项目仓库克隆到本机。

    ```
    $ git clone https://github.com:your-user-name/cloudberrydb.git
    ```

3. 添加上游仓库（你只需执行本次操作，后续可跳过该步骤）。

    ```
    $ git remote add upstream https://github.com/cloudberrydb/cloudberrydb.git
    ```    

    现在，在终端运行 `git remote -v`，你可以看到显示 2 个远程仓库：

    * `upstream`，代表 'cloudberrydb' 仓库
    * `origin`，代表个人 Fork 的仓库

4. 创建并切换到新分支。

    ```
    $ git checkout -b new-branch-name
    ```

5. 在新分支上进行开发，编写代码并运行测试。

6. 在本地保存变更。可参考[提交规范指南](./git#commit-conventions)，以确保提交的信息符合规范。

    ```
    $ git add
    $ git commit
    ```

7. 将本地变更推送到 GitHub 远端仓库。

    ```
    git push origin branch-name
    ```

8. 提交一个 Pull Request。
   
    前往 GitHub 上的 Cloudberry Database 仓库网页，你会看到一条关于你最近推送分支的消息，询问你是否要打开一个 Pull Request。点击创建按钮，然后比较两个仓库异同，接着正式提交 Pull Request 即可。

    对于代码贡献者来说，当你持续优化你的提交时，不要删除审核者的留言或评论。你可以新增变更提交，将其推送到当前 Pull Request 中来。

9.  启动代码评审。

    Cloudberry Database 维护者或其他贡献者将审阅你的 Pull Request，你可以与他们保持互动，配合优化需要做出改动的地方。如果你的 Pull Request 在 2 周内迟迟无人审阅，可在评论中 `@` 活跃的维护者邀请他们评审。

    一旦维护者接受变更，他们会批准通过你的 Pull Request。

10. 恭喜！一旦你的 Pull Request 获得批准，并通过 CI/CD 验证且无错误，代码就能合并到主仓库，并包括在后续新发布的版本中。

:::note

在开始下次贡献前，请确保本地仓库与远程仓库保持同步：

1. 切换到本地主分支。

    ```
    $ git checkout main
    ```

2. 从上游仓库拉取最新变更。

    ```
    $ git fetch upstream
    ```

3. 针对新的开发工作，创建一个新分支。

    ```
    $ git checkout -b branch-name
    ```

如果要将上游的变更应用到当前现有分支，首先要切换到对应分支 `git checkout branch-name`，然后通过命令 `git rebase upstream/main` 将上游变更应用到最新代码之上。

我们希望你的 Pull Request 有一个干净的提交历史，但在实际操作过程中，你可能会将多个提交推送到一个 Pull Request 里。为确保提交历史整洁，请在合并 Pull Request 之前运行 `git rebase -i` 将多个提交压缩到 1 个提交里。

了解更多 Git 操作：

* [解决合并冲突](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/)
* [使个人 Pull request 与基础分支保持同步](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch)
* [在命令行中使用 Git rebase：压缩、移动、合并、分割提交](https://docs.github.com/en/get-started/using-git/using-git-rebase-on-the-command-line)

:::

## 代码审阅

任何人都可以审阅其他开发人员提交的代码，尤其是当你可能会用到该功能时。

在代码评审过程中，请牢记并问自己这些问题：

- 我们想在 Cloudberry Database 中这样做吗？有可能用到它吗？作为 Cloudberry Database 用户，你是否喜欢该更改并打算使用它？该变更符合 Cloudberry Database 的演进方向吗？新功能的维护成本高不高，是否值得长期投入？
- 该变更太大，很难评审吗？需要将该 Pull Request 拆分成多个小的提交？
- 如果该变更源自一项提案，那提案是否已被接受，到开始代码实现阶段了？
- 该功能是否和已有的代码变更重复？
- 代码是否遵循我们的代码规范？
- 开始代码评审前，需要发起一项提案？
- 该 Pull Request 的提交信息是否遵循我们的提交规范？
- 该 Pull Request 是否基于最新代码？提交历史是否干净？
- 代码实现的功能兼容性如何？
- 该 Pull Request 的 CI/CD 验证是否跑通？
- 代码实现是否高效？需要重写吗？
- 该变更是否引入了新的依赖项？引入的依赖组件是否与 Apache License V2.0 许可保持兼容？
- 有没有更改文件的许可文件头？如果更改了，是否合规？
- 代码可读性如何？变量名是否清晰，或与已有变量名保持一致？是否添加相关注释？

:::note

代码评审中可能会使用一些缩略词，可参阅[此处](./git#acronyms-and-abbreviations)。

:::

## 贡献者检查清单

* 阅读贡献指南。
* 阅读社区行为准则。
* 确保你已签署贡献者许可协议（Contributor License Agreement，CLA），尤其是首次贡献者。
* 检查你的更改是否与 Cloudberry Database 编码风格保持一致。
* 确保你的 Pull Request 具有清晰的标题和提交信息。
* 在 Pull Request 和提交信息中列出关联的 [GitHub
  issue](https://github.com/cloudberrydb/cloudberrydb/issues) 或
  [Discussions](https://github.com/orgs/cloudberrydb/discussions) 链接（如有）。
* 运行单元测试和回归测试。
* 本地通过 `make installcheck` 和 `make -C src/test installcheck-cbdb-parallel` 测试。
* 确保导入的组件许可与 Apache License V2 保持兼容。