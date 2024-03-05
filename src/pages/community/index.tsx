import { COMMUNITY_PAGE, LINK_NAV_CONFIG } from "@site/src/consts/community";
import clsx from "clsx";
import ColorCard from "../../components/common/ColorCard";
import CommonLayout from "../../components/common/Layout";
import LinkNav from "../../components/common/LinkNav";
import Card from "../../components/community/Card";
import CardWrap from "../../components/community/CardWrap";
import styles from "../../css/pages/community.module.scss";

export default function Community(): JSX.Element {
  return (
    <CommonLayout>
      <ColorCard
        titleText={COMMUNITY_PAGE.headerCard.titleText}
        subText={COMMUNITY_PAGE.headerCard.subText}
      />
      <div className={clsx(styles.main)}>
        <div className={clsx(styles.leftContent)}>
          {COMMUNITY_PAGE.cardWraps.map((cardWrap) => {
            return (
              <CardWrap title={cardWrap.title} key={cardWrap.title}>
                {cardWrap.cardLines.map((cardLine, index) => {
                  return (
                    <div
                      className={clsx(styles.cardLine, styles.getInvolved)}
                      style={cardLine.style}
                      key={index}
                    >
                      {cardLine.cards.map((card, idx) => {
                        return (
                          <Card
                            key={idx}
                            icon={card.icon}
                            title={card.title}
                            content={card.content}
                            link={card.link}
                            style={card.style}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </CardWrap>
            );
          })}
        </div>
        <div className={clsx(styles.rightContent)}>
          <LinkNav
            className={styles.navLinkWrap}
            config={LINK_NAV_CONFIG}
          ></LinkNav>
        </div>
      </div>
    </CommonLayout>
  );
}
