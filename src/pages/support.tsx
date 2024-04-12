import clsx from "clsx";
import ColorCard from "../components/common/ColorCard";
import CommonLayout from "../components/common/Layout";
import LinkWithBaseUrl from "../components/common/LinkWithBaseUrl";
import Table from "../components/common/Table";
import styles from "../css/pages/support.module.scss";
const tableData = [
  {
    type: (
      <LinkWithBaseUrl href="/download" className="active-color">
        Download
      </LinkWithBaseUrl>
    ),
    desc: "You can download the Cloudberry Database releases and see the changelogs.",
  },
  {
    type: (
      <LinkWithBaseUrl href="/docs" className="active-color">
        Documentation
      </LinkWithBaseUrl>
    ),
    desc: (
      <>
        Official documentation for Cloudberry Database. You can explore it to
        discover more details about us. If you want to contribute, see{" "}
        <LinkWithBaseUrl href="/contribute/doc" className="active-color">
          the guide
        </LinkWithBaseUrl>
        .
      </>
    ),
  },
  {
    type: "Report bugs",
    desc: (
      <>
        Problems and issues in Cloudberry Database core. If you find bugs,
        welcome to submit them{" "}
        <LinkWithBaseUrl
          href="https://github.com/cloudberrydb/cloudberrydb/issues"
          className="active-color"
          target="_blank"
        >
          here
        </LinkWithBaseUrl>
        .
      </>
    ),
  },
  {
    type: "Report a security vulnerability",
    desc: (
      <>
        View our{" "}
        <LinkWithBaseUrl
          href="https://github.com/cloudberrydb/cloudberrydb/security/policy"
          className="active-color"
          target="_blank"
        >
          security policy
        </LinkWithBaseUrl>{" "}
        to learn how to report and contact us.
      </>
    ),
  },
  {
    type: "Q&A",
    desc: (
      <>
        Ask for help when running/developing Cloudberry Database, visit GitHub{" "}
        <LinkWithBaseUrl
          href="https://github.com/orgs/cloudberrydb/discussions/categories/q-a"
          className="active-color"
          target="_blank"
        >
          Discussions - QA
        </LinkWithBaseUrl>
        .
      </>
    ),
  },
  {
    type: "New ideas / Feature Requests",
    desc: (
      <>
        Share ideas for new features, visit{" "}
        <LinkWithBaseUrl
          href="https://github.com/orgs/cloudberrydb/discussions/categories/ideas-feature-requests"
          className="active-color"
          target="_blank"
        >
          GitHub Discussions - Ideas
        </LinkWithBaseUrl>
        .
      </>
    ),
  },
  {
    type: "Code contribution",
    desc: (
      <>
        Fix bugs, add new features to Cloudberry Database, visit our guide on{" "}
        <LinkWithBaseUrl
          href="/contribute/how-to-contribute"
          className="active-color"
        >
          "How to Contribute"
        </LinkWithBaseUrl>
        ,{" "}
        <LinkWithBaseUrl href="/contribute/git" className="active-color">
          {" "}
          "Working with Git & GitHub"
        </LinkWithBaseUrl>
        ,{" "}
        <LinkWithBaseUrl href="/contribute/code" className="active-color">
          "Code Contribution Guide"
        </LinkWithBaseUrl>
        , and{" "}
        <LinkWithBaseUrl href="/contribute/proposal" className="active-color">
          "Proposal Guide"
        </LinkWithBaseUrl>
        .
      </>
    ),
  },
  {
    type: "Community events",
    desc: (
      <>
        Including meetups, webinars, conferences, and more events, visit the{" "}
        <LinkWithBaseUrl href="/community/events" className="active-color">
          Events page
        </LinkWithBaseUrl>{" "}
        and subscribe events calendar.
      </>
    ),
  },
  {
    type: "Brand Guidelines",
    desc: (
      <>
        Guide on how to download, and use our logos and fonts, visit our{" "}
        <LinkWithBaseUrl href="/community/brand" className="active-color">
          Brand Guidelines
        </LinkWithBaseUrl>
        .
      </>
    ),
  },
  {
    type: "Social channels",
    desc: (
      <>
        Follow our{" "}
        <LinkWithBaseUrl
          href="https://twitter.com/cloudberrydb"
          className="active-color"
          target="_blank"
        >
          Twitter
        </LinkWithBaseUrl>
        ,{" "}
        <LinkWithBaseUrl
          href="https://youtube.com/@cloudberrydb"
          className="active-color"
          target="_blank"
        >
          Youtube
        </LinkWithBaseUrl>{" "}
        to help spread good words on Cloudberry Database. Welcome to{" "}
        <LinkWithBaseUrl
          href="https://cloudberrydb.org/community/slack"
          className="active-color"
          target="_blank"
        >
          Slack
        </LinkWithBaseUrl>{" "}
        or{" "}
        <LinkWithBaseUrl
          href="https://cloudberrydb.org/community/wechat"
          className="active-color"
          target="_blank"
        >
          WeChat
        </LinkWithBaseUrl>{" "}
        for real-time chat.
      </>
    ),
  },
];

export default function Support() {
  return (
    <CommonLayout>
      <ColorCard
        titleText="Cloudberry Database Support"
        subText="Welcome to our support page! Our team is ready to help you make the most of the Cloudberry Database. Explore the resources and let us assist you in harnessing its full potential."
      />
      <div className={styles.mainContent}>
        <div className={clsx(styles.content, "global-width")}>
          <div className={styles.subText}>
            This page shows that how you can ask for help and get support from
            our community.
          </div>

          <div className={styles.typeDesc}>
            <Table
              style={{
                width: 795,
              }}
              className={styles.table}
              data={tableData}
              tableColumns={[
                { label: "Type", prop: "type", width: 290 },
                { label: "Description", prop: "desc" },
              ]}
            />
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
