import LinkWithBaseUrl from "../components/common/LinkWithBaseUrl";
import { isZhLangrage } from "../utils";

const configData = {
  titleText: "Cloudberry Database Support",
  subText:
    "Welcome to our support page! Our team is ready to help you make the most of the Cloudberry Database. Explore the resources and let us assist you in harnessing its full potential.",
  contentTextDesc:
    "This page shows that how you can ask for help and get support from our community.",
  tableData: [
    {
      type: (
        <LinkWithBaseUrl href="/docs/releases/" className="active-color">
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
            href="/community/slack"
            className="active-color"
            target="_blank"
          >
            Slack
          </LinkWithBaseUrl>{" "}
          or{" "}
          <LinkWithBaseUrl
            href="/community/wechat"
            className="active-color"
            target="_blank"
          >
            WeChat
          </LinkWithBaseUrl>{" "}
          for real-time chat.
        </>
      ),
    },
  ],
  communitySupportText: "Community Support",
  commercialSupportText: "Commercial support",
  commercialDesc: (
    <>
      Commercial support is available from many companies that provide
      professional services to the Cloudberry Database community. You can{" "}
      <LinkWithBaseUrl
        className={"active-color"}
        href="https://hashdata.feishu.cn/share/base/form/shrcnJIVr3gTDXPvKkWMtBkXv5e?open_in_browser=true"
      >
        submit your support request
      </LinkWithBaseUrl>{" "}
      to us.
      <div style={{ fontSize: "smaller" }}>
        We will help coordinate with the relevant vendors to assist you in
        resolving your troubles. By submitting the request form, you acknowledge
        that we will share your information with the appropriate vendors.
      </div>
    </>
  ),
};

if (isZhLangrage()) {
  configData.titleText = "Cloudberry Database 支持";
  configData.subText =
    "欢迎来到支持页面！我们随时待命，帮你用好 Cloudberry Database。探索可用资源，发挥 Cloudberry Database 全部潜力。";
  configData.contentTextDesc = "本页展示了如何寻求帮助和支持。";
  configData.tableData = [
    {
      type: (
        <LinkWithBaseUrl href="/docs/releases/" className="active-color">
          软件下载
        </LinkWithBaseUrl>
      ),
      desc: "你可以下载 Cloudberry Database 对应版本并查看更新日志。",
    },
    {
      type: (
        <LinkWithBaseUrl href="/docs" className="active-color">
          用户文档
        </LinkWithBaseUrl>
      ),
      desc: (
        <>
          Cloudberry Database 的官方文档。你可以浏览文档，了解更多详细信息。如果你想为文档做出贡献，请参阅{""}
          <LinkWithBaseUrl href="/contribute/doc" className="active-color">
          《文档贡献指南》
          </LinkWithBaseUrl>
          。
        </>
      ),
    },
    {
      type: "报告错误",
      desc: (
        <>
          反馈 Cloudberry Database 核心中的问题。如果你发现了 Bug，欢迎提交到
          {" "}
          <LinkWithBaseUrl
            href="https://github.com/cloudberrydb/cloudberrydb/issues"
            className="active-color"
            target="_blank"
          >
            GitHub Issue
          </LinkWithBaseUrl>
          。
        </>
      ),
    },
    {
      type: "报告安全漏洞",
      desc: (
        <>
          查看{""}
          <LinkWithBaseUrl
            href="https://github.com/cloudberrydb/cloudberrydb/security/policy"
            className="active-color"
            target="_blank"
          >
          《安全策略》
          </LinkWithBaseUrl>{""}
          了解如何报告安全问题，以及如何与我们联络。
        </>
      ),
    },
    {
      type: "Q&A / 问答",
      desc: (
        <>
          在运行/开发 Cloudberry Database 时遇到问题，可在 {" "}
          <LinkWithBaseUrl
            href="https://github.com/orgs/cloudberrydb/discussions/categories/q-a"
            className="active-color"
            target="_blank"
          >
            GitHub Discussions - QA 
          </LinkWithBaseUrl>{" "}
            模块发帖求助。
        </>
      ),
    },
    {
      type: "新点子 / 功能需求",
      desc: (
        <>
          分享有关新功能的想法，请前往{" "}
          <LinkWithBaseUrl
            href="https://github.com/orgs/cloudberrydb/discussions/categories/ideas-feature-requests"
            className="active-color"
            target="_blank"
          >
            GitHub Discussions - Ideas
          </LinkWithBaseUrl>{" "}
          模块发帖。
        </>
      ),
    },
    {
      type: "代码贡献",
      desc: (
        <>
          贡献方式多种多样，如修复错误、为 Cloudberry Database 开发新功能，详情可参考文档
          <LinkWithBaseUrl
            href="/contribute/how-to-contribute"
            className="active-color"
          >
            《如何做出贡献》
          </LinkWithBaseUrl>
          、
          <LinkWithBaseUrl href="/contribute/git" className="active-color">
            《使用 Git & GitHub》
          </LinkWithBaseUrl>
          、
          <LinkWithBaseUrl href="/contribute/code" className="active-color">
            《代码贡献指南》
          </LinkWithBaseUrl>
          以及
          <LinkWithBaseUrl href="/contribute/proposal" className="active-color">
            《Cloudberry Database 提案指南》
          </LinkWithBaseUrl>
          等。
        </>
      ),
    },
    {
      type: "社区活动",
      desc: (
        <>
          包括 Meetup、网络研讨会 Webinar、会议和更多活动信息，可查看页面
          <LinkWithBaseUrl href="/community/events" className="active-color">
            社区活动
          </LinkWithBaseUrl>
            了解详情，并订阅活动日历。
        </>
      ),
    },
    {
      type: "品牌指南",
      desc: (
        <>
          关于如何下载和使用项目 Logo、名称和字体等事宜，可查看文档
          <LinkWithBaseUrl href="/community/brand" className="active-color">
            《品牌指南》
          </LinkWithBaseUrl>
          了解详情。
        </>
      ),
    },
    {
      type: "社交渠道",
      desc: (
        <>
          欢迎关注{" "}
          <LinkWithBaseUrl
            href="https://twitter.com/cloudberrydb"
            className="active-color"
            target="_blank"
          >
            Twitter
          </LinkWithBaseUrl>
          、
          <LinkWithBaseUrl
            href="https://youtube.com/@cloudberrydb"
            className="active-color"
            target="_blank"
          >
            Youtube
          </LinkWithBaseUrl>{" "}
          与我们互动，并转发 Cloudberry Database 相关话题和推文。同时，欢迎加入{" "}
          <LinkWithBaseUrl
            href="/community/slack"
            className="active-color"
            target="_blank"
          >
            Slack
          </LinkWithBaseUrl>{" "}
          或{" "}
          <LinkWithBaseUrl
            href="/community/wechat"
            className="active-color"
            target="_blank"
          >
            微信
          </LinkWithBaseUrl>{" "}
          对应频道或群组，与社区成员聊天。
        </>
      ),
    },
  ];
  configData.communitySupportText = "社区支持";
  configData.commercialSupportText = "商业服务";
  configData.commercialDesc = (
    <>
      目前有众多公司为 Cloudberry Database 社区提供商业服务支持。你可以
      <LinkWithBaseUrl
        className={"active-color"}
        href="https://hashdata.feishu.cn/share/base/form/shrcnJIVr3gTDXPvKkWMtBkXv5e?open_in_browser=true"
      >
        点此提交支持需求表单。
      </LinkWithBaseUrl>
      <div style={{ fontSize: "smaller" }}>
        我们将协调相关商业服务商，以帮助为你提供最优支持方案。提交支持需求表单，意味着你已同意我们将与合适的供应商共享你的需求信息。
      </div>
    </>
  );
}
export default configData;
