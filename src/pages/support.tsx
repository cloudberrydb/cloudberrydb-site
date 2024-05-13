import clsx from "clsx";
import ColorCard from "../components/common/ColorCard";
import CommonLayout from "../components/common/Layout";
import Table from "../components/common/Table";
import configData from "../consts/support";
import styles from "../css/pages/support.module.scss";

const { tableData, contentTextDesc, subText, titleText } = configData;
export default function Support() {
  return (
    <CommonLayout>
      <ColorCard titleText={titleText} subText={subText} />
      <div className={styles.mainContent}>
        <div className={clsx(styles.content, "global-width")}>
          <div className={styles.subText}>{contentTextDesc}</div>

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
