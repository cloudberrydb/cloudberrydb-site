import {
  BOOTCAMP_PAGE_CONFIG,
  LINK_NAV_CONFIG,
} from "@site/src/consts/bootcamp";
import MainContent from "../../components/bootcamp/MainContent";
import TextPic from "../../components/bootcamp/TextPic";
import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
export default function BootCamp(): JSX.Element {
  return (
    <CommonLayout>
      <ColorCard {...BOOTCAMP_PAGE_CONFIG.headerCard} />
      <div className="main global-width-layout flex">
        <div className="leftContent" style={{ width: 980 }}>
          <TextPic />
          <MainContent />
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
            config={LINK_NAV_CONFIG}
          ></LinkNav>
        </div>
      </div>
    </CommonLayout>
  );
}
