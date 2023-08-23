---
title: Code Contribution Guide
---

# Code Contribution Guide

## Code of Conduct

Everyone who participates in Cloudberry Database, either as a user or
a contributor, is obliged to follow our [community Code of
Conduct](../community/coc).

## Ready to contribute

Before starting to contribute, please read the guide ["How to
Contribute"](/contribute/how-to-contribute) and make sure to learn
[Git & GitHub](/contribute/git) well.

Especially as a new code contributor, don't rush to start. We suggest
that you understand our project, read the documentation, learn the
code conventions, know how to [write proposals](./proposal), and
familiarize yourself with the community. Then start small.

You can look for easy issues to fix or small features to add, such as
the GitHub Issues with labels “good first issue” and "help wanted"
which can help you familiarize yourself with the contribution
workflow, and for the dev teams to become acquainted with you.

In addition, all code contributors are required to sign a Contributor
License Agreement (CLA), you can sign it as CLAassistant prompts when
submitting your first Pull Request.

:::caution

It's not required for upstream contributors to sign CLA if you cherry
pick the commits from upstream projects like PostgreSQL or Greenplum
Database, so just ignore the CLAassistant's warning, which will don't
block your PR's merge.

:::

:::warning

In addition, please don't change(remove) the original copyright
information and open source license headers. If you have modified the
files at large, you can add information following the original file
license.

Don't import components under GPLv2/3 License or other non-OSI
licenses for your code, which will interfere with Cloudberry
Database's Apache License. If you are not sure, please contact
info@cloudberrydb.org.

:::

To avoid duplicating work, please review the [Cloudberry Database
Proposals](./proposal) or ask directly in our Slack before
you start work on a non-trivial feature.

## Code Conventions

Source code should follow the [PostgreSQL coding
conventions](https://www.postgresql.org/docs/current/source.html).

### Source Formatting

This includes [source
formatting](https://www.postgresql.org/docs/current/source-format.html)
with 4 column tab spacing, layout rules according to the BSD style and
line length within 80 columns. Though there are many different styles
in the PostgreSQL codebase we can `try to make your patch consistent
with nearby code`(See discussions in [PostgreSQL mailing
list](https://www.postgresql.org/message-id/16342.1221133325%40sss.pgh.pa.us).)

We can use existing configurations for Cloudberry Database
development, such as
[Vim](https://github.com/cloudberrydb/cloudberrydb/blob/main/src/tools/editors/vim.samples),
[Emacs](https://github.com/cloudberrydb/cloudberrydb/blob/main/src/tools/editors/emacs.samples),
[Clion](https://github.com/cloudberrydb/cloudberrydb/blob/main/src/tools/editors/clion.xml)
and [other
editors](https://github.com/cloudberrydb/cloudberrydb/blob/main/.editorconfig).

### Error Messages

Error messages style follows [PostgreSQL Error Message Style
Guide](https://www.postgresql.org/docs/current/error-style-guide.html).

## Contribution workflow

The following will describe how to submit your code contribution as
`Pull Request` to Cloudberry Database. If you still don't know well
how to work with Git and GitHub, please read [our
guide](./git) again.

To contribute to Cloudberry Database development:

1. Fork the [Cloudberry Database
repo](https://github.com/cloudberrydb/cloudberrydb) to your own GitHub
account.

2. Clone down the repo to your local system.

```
$ git clone git@github.com:your-user-name/cloudberrydb.git
```

3. Add the upstream repo. (You only have to do this once, not every
time.)

```
$ git remote add upstream https://github.com/cloudberrydb/cloudberrydb.git
```

now, when you run `git remote -v` will show two remote repositories
named:

* `upstream`, which refers to the 'cloudberrydb' repository
* `origin`, which refers to your personal fork

4. Create a new branch to hold your work.

```
$ git checkout -b new-branch-name
```

5. Work on your new code. Write and run tests.

6. Commit your changes. For writing a good commit message, please
refer to [Commit Conventions](./git#commit-conventions).

```
$ git add
$ git commit
```

7. Push your changes to your GitHub repo.

```
git push origin branch-name
```

8. Open a PR(Pull Request).

Go to the Cloudberry Database repo on GitHub. There will be a message
about your recently pushed branch, asking if you would like to open a
pull request. Follow the prompts, compare across repositories, and
submit the PR.

For code contributors, don’t rebase your branch orotherwise modify
published commits during the code review process, since this can
remove existing comment history and confuse the reviewers when
reviewing. When you make a revision, always push it in a new commit.

9. Get your code reviewed.

Cloudberry Database maintainers and other contributors will review
your PR. Please participate in the conversation, and try to make any
requested changes. If you get no review comments within two weeks,
feel free to ask for feedback by mentioning @cloudberry/dev team in
your PR comment.

Once the maintainers are happy with your change, they'll approve the
pull request. At this point, the maintainer will take over, possibly
make some additional touch ups, and merge your changes into the
codebase.

10. Congratulations! Once your PR is approved by at least 2
maintainers with write access, and passes the CI/CD without errors,
then the code will be merged. Your code will be shipped in the recent
future releases.

:::note

Before working on your next contribution, make sure your local
repository is up to date:

1. Switch to the local main branch.

```
$ git checkout main
```

2. Fetch the latest changes from upstream.

```
$ git fetch upstream
```

3. Create a new branch if you are starting new work.

```
$ git checkout -b branch-name
```

If you want to update your existing branch with changes from upstream,
you need to run `git checkout branch-name`, then rebase your branch on
upstream main by `git rebase upstream/main`.

We also want your PR to have a clean commit history, but in the real
world, you may have pushed multiple commits into a single pull
request. To ensure a clean merge, please run `git rebase -i` to squash
your commits down to 1 commit before the pull request is merged.

Learn more:

* [Resolving merge
conflicts](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/)
* [Keeping your pull request in sync with the base
branch](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch)
* [Using Git rebase on the command line: Squash, Move, Merge, Split,
Fix your
commits](https://docs.github.com/en/get-started/using-git/using-git-rebase-on-the-command-line)

:::

## Code review

We encourage anyone to start reviewing code submitted by other
developers, especially if the feature is something that you are likely
to use.

Here are some questions to keep in mind during the code review
process:

- Do we want this in Cloudberry Database? Is it likely to be used? Do
  you, as a Cloudberry Database user, like the change and intend to
  use it? Is this change in the scope of Cloudberry Database? Will the
  cost of maintaining a new feature be worth its benefits?
- Is it too large to review? Does it need to split into multi PR?
- If it's a proposal, does it have been accepted and start to code?
- Is it duplicated with other existing code contributions in CBDB or
  commits in upstream projects?
- Does it follow our code conventions?
- Does it need to have a proposal before getting the code review?
- Does the PR have a good commit message following our commit
  conventions?
- Does the PR need to rebase to have a clean commit history and be in
  sync with the base branch?
- Is the code backward compatible with previous versions?
- Does its test pipeline run well?
- Is the code efficient? Could it be rewritten easily to run more
  efficiently?
- Will the new code add new dependencies on other libraries?
- Does the change import new components with licenses incompatible
  with Apache License V2.0?
- Does it modify the files' license headers? If so, is it ok?
- Is the code human-readable? Is it low on redundancy? Should variable
  names be improved for clarity or consistency? Should comments be
  added? Should any comments be removed as unhelpful or extraneous?

:::note

For acronyms and abbreviations used in the code review, you can read
[here](./git#acronyms-and-abbreviations).

:::

## Contributor checklist

* Read the contributing guidelines.
* Read the Code of Conduct.
* Ensure you have signed the Contributor License Agreement (CLA),
  especially for your first-time contribution.
* Check if your changes are consistent with the Cloudberry Database
  coding style.
* Make sure your Pull Request has a clear title and commit message.
* List your communication in the [GitHub
  Issues](https://github.com/cloudberrydb/cloudberrydb/issues) or
  [Discussions](https://github.com/orgs/cloudberrydb/discussions) (if
  has or needed).
* Run the unit tests and regression tests.
* Pass `make installcheck`, `make -C src/test
  installcheck-cbdb-parallel`
* Import some components with Apache License V2 compatible license.
