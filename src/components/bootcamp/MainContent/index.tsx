import {
  BOOTCAMP_PAGE_CONFIG,
  LINK_NAV_CONFIG,
} from "@site/src/consts/bootcamp";
import Card from "../Card";
import CardLine from "./CardLine";
import styles from "./styles.module.scss";

export default function MainContent() {
  const { DATA_0, DATA_101, DATA_102, DATA_103, DATA_104, GET_SOURCE } =
    BOOTCAMP_PAGE_CONFIG;

  return (
    <div className={styles.mainContent}>
      <div className="main-title" style={{ marginBottom: 22 }}>
        {DATA_0.title}
      </div>
      <div
        className="sub-title scroll-id-select"
        data-id={LINK_NAV_CONFIG[0].id}
        style={{ marginBottom: 31 }}
      >
        {DATA_0.subTitle}
      </div>

      <Card {...DATA_0.card} />

      <div
        className="sub-title scroll-id-select"
        data-id={LINK_NAV_CONFIG[1].id}
        style={{ marginBottom: 31, marginTop: 69 }}
      >
        {DATA_101.title}
      </div>
      <div className="sub-text">{DATA_101.subText}</div>

      <div
        className={styles.cardLine}
        style={{
          marginTop: 25,
          marginBottom: 32,
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
        }}
      >
        <CardLine cardLine={DATA_101.cardLine1} itemWidth={221} />
      </div>

      <div
        className={styles.cardLine}
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <CardLine cardLine={DATA_101.cardLine2} itemWidth={305.33} />
      </div>

      {/* 102 before */}
      <div
        data-id={LINK_NAV_CONFIG[2].id}
        className="sub-title scroll-id-select"
        style={{ marginBottom: 49, marginTop: 69 }}
      >
        {DATA_102.title}
      </div>
      <Card {...DATA_102.card} />

      {/* 103 before */}
      <div
        data-id={LINK_NAV_CONFIG[3].id}
        className="sub-title scroll-id-select"
        style={{ marginBottom: 39, marginTop: 69 }}
      >
        {DATA_103.title}
      </div>
      <div className="sub-text">{DATA_103.subText}</div>
      <div
        className={styles.cardLine}
        style={{ marginTop: 32, gridTemplateColumns: "1fr 1fr" }}
      >
        <CardLine cardLine={DATA_103.cardLine} itemWidth={474} />
      </div>

      {/* 104 before */}
      <div
        data-id={LINK_NAV_CONFIG[4].id}
        className="sub-title scroll-id-select"
        style={{ marginTop: 69, marginBottom: 49 }}
      >
        {DATA_104.title}
      </div>
      <div
        className={styles.cardLine}
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        <CardLine cardLine={DATA_104.cardLine} itemWidth={474} />
      </div>

      {/* Get the Source */}
      <div className="main-title" style={{ marginTop: 61, marginBottom: 16 }}>
        {GET_SOURCE.title}
      </div>
      <div className="sub-text" style={{ marginBottom: 62 }}>
        {GET_SOURCE.content}
      </div>
    </div>
  );
}
