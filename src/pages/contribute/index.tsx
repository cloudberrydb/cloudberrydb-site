import {
  CONTRIBUTE_PAGE_CONFIG,
  LINK_NAV_CONFIG,
} from "@site/src/consts/contribute";
import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
import TextListItem from "../../components/contribute/TextListItem";
import styles from "../../css/pages/contribute.module.scss";

export default function Contribute(): JSX.Element {
  return (
    <CommonLayout>
      <ColorCard
        titleText={CONTRIBUTE_PAGE_CONFIG.headerCard.titleText}
        subText={CONTRIBUTE_PAGE_CONFIG.headerCard.subTitle}
      />
      <div className={styles.globalWidth}>
        <div className={styles.mainContent}>
          <div className={styles.leftContent}>
            {CONTRIBUTE_PAGE_CONFIG.textListItems.map((item, index) => {
              return <TextListItem {...item} key={index} />;
            })}
          </div>
          <div className={styles.rightContent}>
            <LinkNav
              className={styles.navLinkWrap}
              config={LINK_NAV_CONFIG}
            ></LinkNav>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
