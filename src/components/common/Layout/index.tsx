import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
interface IProps {
  children: React.ReactElement | React.ReactElement[];
}
export default function CommonLayout({ children }: IProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Cloudberry Database ships with PostgreSQL 14.4 as the kernel. It is 100% open source and helps you leverage the value of your data."
    >
      {/* The main tag is used for special handling of layout styles, and cannot be a div tag here */}
      <main>{children}</main>
    </Layout>
  );
}
