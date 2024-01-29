import MainContent from "../../components/bootcamp/MainContent";
import TextPic from "../../components/bootcamp/TextPic";
import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
import { formatStrHorizontalLine } from "../../utils";
export default function BootCamp(): JSX.Element {
  const linkNavConfig = [
    {
      label: "CloudberryDB Sandbox",
      id: "",
    },
    {
      label: "101-CloudberryDB Tourials",
      id: "",
    },
    {
      label: "102-CloudberryDB Crash Course",
      id: "",
    },
    {
      label: "103-CloudberryDB Performance Benchmark",
      id: "",
    },
    {
      label: "104-CloudberryDB for Data Science",
      id: "",
    },
  ];
  linkNavConfig.forEach((item) => {
    item.id = formatStrHorizontalLine(item.label);
  });
  return (
    <CommonLayout>
      <ColorCard
        titleText="Cloudberry Database Bootcamp"
        subText="Join us on an exciting journey to explore the features of Cloudberry Database using a Docker engine-based sandbox. Get ready to elevate your database skills. Happy exploring!"
      />
      <div className="main global-width-layout flex">
        <div className="leftContent" style={{ width: 980 }}>
          <TextPic />
          <MainContent linkNavConfig={linkNavConfig} />
        </div>
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <LinkNav
            style={{
              position: "sticky",
              width: 196,
              height: 203,
              marginLeft: 108,
              marginTop: 51,
              top: 130,
            }}
            config={linkNavConfig}
          ></LinkNav>
        </div>
      </div>
    </CommonLayout>
  );
}
