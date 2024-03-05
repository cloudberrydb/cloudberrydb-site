import {
  BOOTCAMP_PAGE_CONFIG,
  LINK_NAV_CONFIG,
} from "@site/src/consts/bootcamp";
import clsx from "clsx";
import MainContent from "../../components/bootcamp/MainContent";
import TextPic from "../../components/bootcamp/TextPic";
import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
import styles from "../../css/pages/bootcamp.module.scss";

export default function BootCamp(): JSX.Element {
  return (
    <CommonLayout>
      <ColorCard {...BOOTCAMP_PAGE_CONFIG.headerCard} />
      <div className={clsx(styles.wrap, "global-width-layout flex")}>
        <div className={styles.leftContent}>
          <TextPic />
          <MainContent />
        </div>
        <div className={styles.navLinkWrap}>
          <LinkNav
            className={styles.navLinkComp}
            config={LINK_NAV_CONFIG}
          ></LinkNav>
        </div>
      </div>
    </CommonLayout>
  );
}
