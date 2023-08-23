---
title: Working with Git & GitHub
---

# Working with Git & GitHub

Cloudberry Database is hosted on GitHub. We use GitHub Issues as the
bug report system, use GitHub Discussions for discussion and get
feedback, and use Git as our version control system. Given these, it's
important for community users and developers to learn how to work well
with GitHub and Git.

Please note, we do not aim to write one complete guide for Git or
GitHub on this page, but we list the key points in your future work.

## Get ready for working

### Step 1: Set up your GitHub.com account

Before we start, it's necessary to have a GitHub account. If not,
please create one.

Then you need to edit your public GitHub profile, including your name,
avatar, bio, social accounts, etc. to let other people know you.

### Step 2: Configure two-factor authentication

This is required only for Cloudberry Database organization members,
including committers, and PMC members. If you're an outside
contributor, you can skip this step.

You can take [GitHub Document: Configuring two-factor
authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)
for reference.

### Step 3: Install Git

If you don't have Git installed, you can download Git at
[www.git-scm.com](http://www.git-scm.com/).

If you need additional assistance in installing Git, you can find more
information in [the ProGit chapter on installing
Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Step 4: Set your Git name and email

Run the following commands in the terminal to set your email address
and your name, which will be visible in your commits of Pull Request:

```
git config --global user.email "Your Email"
git config --global user.name "Your Name"
```

:::caution

If you are used to working on different laptops, please make sure to
have the same email address and name settings for your Git, in case
that our CLABot has difficulty detecting the contributor information.

:::

### Step 5: Set up your text editor

Run the following command to set up your favorite editor, which will
be used to open and edit your files with Git:

```
git config --global core.editor "vim"
```

For more editors, such as `Visual Studio Code`, `Sublime Text`, and
`TextMate`, see the [GitHub
Document](https://docs.github.com/en/get-started/getting-started-with-git/associating-text-editors-with-git?platform=mac).

### Step 6: Learn about GitHub flow

Follow [this
document](https://docs.github.com/en/get-started/quickstart/github-flow)
to learn about the GitHub flow, including how to create a branch, make
changes, create a pull request, address review comments, and merge the
pull request.

## Commit Conventions

We have one [git commit message
template](https://raw.githubusercontent.com/cloudberrydb/cloudberrydb/main/.gitmessage)
for coding contributions. You can download the file and run the
following command to apply it globally:

```
git config --global commit.template .gitmessage
```

We have marked the important notes in the above template. For more on
how to write a good commit message, you can read this blog:
https://cbea.ms/git-commit/.

:::caution

Once the commit message template is applied, please use `git commit`
instead of `git commit -m "CommitMessage..."` when committing changes,
the latter command cannot edit the message body.

:::

If you need to rewrite the most recent commit message, please use `git
commit --amend` command, and see more on [GitHub
Documentation](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/changing-a-commit-message),
but it doesn't support our customized message template.

## GitHub Label System

:::info

Only the member with triage or write access can add or edit the labels
now. GitHub Discussions and GitHub Issues use the same label system.

:::

<table>
<thead>
<tr>
<th>Priority</th>
<th>Type</th>
<th>Status</th>
<th>Standard</th>
</tr>
</thead>
<thead>
<tr>
<th><small>the urgency of issue or PR</small></th>
<th><small>the type of Issue or PR</small></th>
<th><small>the progress of Issue or PR</small></th>
<th><small>commonly used in most projects</small></th>
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

**Description of the labels:**

```
#Priority
    priority: Urgent - This should be dealt with ASAP. Not fixing this issue would be a serious error.
    priority: High - After critical issues are fixed, these should be dealt with before any further issues.
    priority: Medium - This issue may be useful, and needs some attention.
    priority: Low - This issue can probably be picked up by anyone looking to contribute to the project, as an entry fix

#Type
    type: Announcement - New Release, Events, Blog and more
    type: Proposal - Proposals of major changes to Cloudberry Database
    type: Enhancement - New feature or request, ideas
    type: Question - Ask the community for help
    type: Documentation - Improvements or additions to documentation
    type: Bug - Something isn't working
    type: Refactoring - A code change that neither fixes a bug nor adds a feature
    type: Testing - Adding missing tests or correcting existing tests
    type: Security - Vulnerability disclosure or Fixing security issue
    type: Backport - Backport compitable related issues or PRs
    type: Pipeline - CICD and development pipeline

#Status
    status: Await triage - This issue needs triage.
    status: In Progress - This issue is being worked on, and has someone assigned.
    status: Not planned - Including Duplicate, Invalid and wontfix issues.
    status: Completed - This label means issues are done, closed, fixed or resovled.

#Standard
    help wanted - Extra attention is needed
    good first issue - Good for newcomers
```

If you add new labels, please follow the format `prefix-name: type`.

## GitHub Issues or GitHub Discussions

We use GitHub Issues as a bug report system and work tracking, use
GitHub Discussions for asking questions and answering, share ideas for
new features, and share proposals for Cloudberry Database.

If you find problems and issues with code in Cloudberry Database core,
welcome to report to [GitHub
Issues](https://github.com/cloudberrydb/cloudberrydb/issues/new/choose).

If you want to ask for help, answer questions, share your new ideas
for features, and get feedback for your proposal, please [create new
discussions](https://github.com/orgs/cloudberrydb/discussions/new/choose)
directly.

| GitHub Discussion Categories | Description                                                      |
|------------------------------|------------------------------------------------------------------|
| Announcements                | New Release, events, blog and more (*Only maintainers can post*) |
| Ideas / Feature Requests     | Share ideas for new features                                     |
| Proposal                     | Share proposals of major changes to Cloudberry Database          |
| Q&A                          | Ask the community for help                                       |

:::note
Read GitHub blog '[What is GitHub Discussions? A complete
guide](https://resources.github.com/devops/process/planning/discussions/)'
to learn more.
:::

## GitHub Projects

Now, our project is only public to the Cloudberry Database
organization members. If you're a member, you can open
https://github.com/orgs/cloudberrydb/projects/5. We list the fields
for your reference.

<table>
<thead>
<tr>
<th>Status</th>
<th>Priority</th>
<th>Size</th>
<th>Story Type</th>
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

## Advanced Usage in GitHub

In addition to the plain text and [basic writing and formatting
syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax),
we can use more formats to communicate clearly in the GitHub pull
requests, issues and comments, such as
[tables](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables),
[diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams),
[task
lists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists)
and more, please refer to [GitHub
Documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting)
for details.

## Acronyms and Abbreviations

We often use some acronyms and abbreviations for the code review, and
comments in our daily GitHub communications. We collect some popular
words to help you leverage them as part of an effective code review
process in the Cloudberry Database community.

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

## Learning Materials

- [Git Cheat Sheet](https://training.github.com/downloads/github-git-cheat-sheet/)
- [Git Document](https://www.git-scm.com/doc)
