import LinkWithBaseUrl from "../components/common/LinkWithBaseUrl";
import { isZhLangrage } from "../utils";

let HOME_HEADER_TIPS = "Cloudberry Database is open sourced now";

let FEATURE_HIGHLIGHT: {
  icon: string;
  lightIcon?: string;
  darkIcon?: string;
  title: string;
  content: string;
}[] = [
  {
    icon: "/img/home/feature/muc.png",
    lightIcon: "/img/home/feature/muc-light.png",
    title: "More Use Cases",
    content:
      "Cloudberry Database can be used in different scenarios, including batch processing data warehouse offline, building data warehouse in real-time, and more. Also, you can use it as an alternative to existing MPP databases.",
  },
  {
    icon: "/img/home/feature/hesc.png",
    lightIcon: "/img/home/feature/hesc-light.png",
    title: "Highly Elastic Scaling Capability",
    content:
      "Cloudberry Database can independently scale out computing and storage resources to achieve fully elastic adjustments in throughput, response time, and data capacity.",
  },
  {
    icon: "/img/home/feature/sac.png",
    lightIcon: "/img/home/feature/sac-light.png",
    title: "Strong Analytical Capability",
    content:
      "Inheriting the rich analytical features from PostgreSQL and Greenplum Database, Cloudberry Database leverages them to the cloud platform, and seamlessly integrates the mainstream ETL and BI tools.",
  },
  {
    icon: "/img/home/feature/cuwmt.png",
    lightIcon: "/img/home/feature/cuwmt-light.png",
    title: "Catch up with Mainstream Technology",
    content:
      "Cloudberry Database supports mainstream data analytical features such as machine learning, graph calculation, and spatiotemporal analyses.",
  },
  {
    icon: "/img/home/feature/p14i.png",
    lightIcon: "/img/home/feature/p14i-light.png",
    title: "PostgreSQL 14 Inside",
    content:
      "Cloudberry Database adopts the newer PostgreSQL version 14 inside to let users enjoy more with the backend global community.",
  },
  {
    icon: "/img/home/feature/mef.png",
    lightIcon: "/img/home/feature/mef-light.png",
    title: "More Enterprise Features",
    content:
      "Cloudberry Database supports multi-tenant management, relational data models, standard JDBC and ODBC interfaces, and more.",
  },
];

let WHY_CLOUDBERRY_DATABASE = [
  {
    pic: "/img/home/os.png",
    title: "100% Open Source",
    desc: "Cloudberry Database is 100% open-sourced with an active community. You can find all the source code on GitHub as you need.",
  },
  {
    pic: "/img/home/pr.png",
    title: "Production Ready",
    desc: "Cloudberry Database has been deployed in many critical production environments with high availability.",
  },
  {
    pic: "/img/home/pc.png",
    title: "PostgreSQL Compatibility",
    desc: "Cloudberry Database is highly compatible with PostgreSQL, enabling you to leverage the advantages of the strong PostgreSQL ecosystem.",
  },
];
let JOIN_COMMUNITY = {
  content: (
    <>
      Cloudberry Database has a growing open source community, with contributors
      from around the globe building features, documentation, and assisting
      other users. There are many ways to contribute to Cloudberry Database, and
      you can easily find the ones that suit your skills and interests to{" "}
      <b>
        <LinkWithBaseUrl style={{ color: "inherit" }} to={"/contribute"}>
          begin your contribution
        </LinkWithBaseUrl>
      </b>{" "}
      journey. Additionally, our community is always there to{" "}
      <b>
        <LinkWithBaseUrl style={{ color: "inherit" }} to="/support">
          help and provide support
        </LinkWithBaseUrl>
      </b>{" "}
      whenever you need it.
    </>
  ),
};

const LINKS = {
  github: "https://github.com/cloudberrydb",
  twitter: "https://twitter.com/cloudberrydb",
  youtube: "https://youtube.com/@cloudberrydb",
  community: "https://communityinviter.com/apps/cloudberrydb/welcome",
  wechat: "/community/wechat",
  discoverMore: "/docs",
};

// zh language
if (isZhLangrage()) {
  HOME_HEADER_TIPS = "Cloudberry Database 现已开源";
  FEATURE_HIGHLIGHT = [
    {
      icon: "/img/home/feature/muc.png",
      lightIcon: "/img/home/feature/muc-light.png",
      title: "更多场景",
      content:
        "Cloudberry Database 可用于多种不同场景，包括离线批处理数据仓库、实时数仓等等。你可以使用 Cloudberry Database 替换其他类型的 MPP 数据库。",
    },
    {
      icon: "/img/home/feature/hesc.png",
      lightIcon: "/img/home/feature/hesc-light.png",
      title: "高弹性扩展能力",
      content:
        "Cloudberry Database 可以独立扩展计算和存储资源，以实现吞吐、响应时间和数据容量弹性调整。",
    },
    {
      icon: "/img/home/feature/sac.png",
      lightIcon: "/img/home/feature/sac-light.png",
      title: "强大的分析能力",
      content:
        "Cloudberry Database 继承了 PostgreSQL 和 Greenplum Database 的丰富分析功能，无缝集成主流的 ETL 和 BI 工具。",
    },
    {
      icon: "/img/home/feature/cuwmt.png",
      lightIcon: "/img/home/feature/cuwmt-light.png",
      title: "支持主流数据分析技术",
      content:
        "Cloudberry Database支持主流数据分析技术，如机器学习、图计算以及时空分析等。",
    },
    {
      icon: "/img/home/feature/p14i.png",
      lightIcon: "/img/home/feature/p14i-light.png",
      title: "使用 PostgreSQL 14.4 内核",
      content:
        "Cloudberry Database 采用 PostgreSQL 14.4 作为内核，用户可充分享受 PostgreSQL 全球社区支撑带来的益处。",
    },
    {
      icon: "/img/home/feature/mef.png",
      lightIcon: "/img/home/feature/mef-light.png",
      title: "更多企业级特性",
      content:
        "Cloudberry Database支持关系数据模型、标准 JDBC 和 ODBC 接口等。",
    },
  ];
  WHY_CLOUDBERRY_DATABASE = [
    {
      pic: "/img/home/os.png",
      title: "100% 开源",
      desc: "Cloudberry Database 核心功能全部开源，你可以在 GitHub 上查看核心源码及周边组件代码。",
    },
    {
      pic: "/img/home/pr.png",
      title: "生产可用",
      desc: "Cloudberry Database 已在诸多关键生产环境中部署使用。",
    },
    {
      pic: "/img/home/pc.png",
      title: "兼容 PostgreSQL 生态",
      desc: "Cloudberry Database 与 PostgreSQL 高度兼容，用户可以充分利用强大的 PostgreSQL 生态系统优势。",
    },
  ];
  JOIN_COMMUNITY.content = (
    <>
      Cloudberry Database
      拥有一个不断壮大的开源社区，来自全球各地的贡献者努力开发功能、写作文档，并协助其他用户解决问题。为
      Cloudberry Database 社区做出贡献途径多种多样，你可以马上{" "}
      <b>
        <LinkWithBaseUrl style={{ color: "inherit" }} to={"/contribute"}>
          开始贡献之旅
        </LinkWithBaseUrl>
      </b>{" "}
      。如果你遇到棘手的问题，可以在合适的渠道{" "}
      <b>
        <LinkWithBaseUrl style={{ color: "inherit" }} to="/support">
          发起求助
        </LinkWithBaseUrl>
      </b>{" "}
      。
    </>
  );
}
FEATURE_HIGHLIGHT.forEach((item) => {
  item.darkIcon = item.icon;
});

export {
  FEATURE_HIGHLIGHT,
  HOME_HEADER_TIPS,
  JOIN_COMMUNITY,
  LINKS,
  WHY_CLOUDBERRY_DATABASE,
};
