import clsx from "clsx";
import BreadCrumbs from "../Breadcrumbs";
import styles from "./styles.module.scss";
interface IProps {
  children: React.ReactElement;
  bgImg?: string;
}
export function ColorHeader({ children, bgImg }: IProps) {
  return (
    <div
      className={clsx(styles.wrap)}
      style={{
        backgroundImage: bgImg ? `url(${bgImg})` : "",
        backgroundSize: bgImg ? "cover" : "",
      }}
    >
      <div className="global-width-layout">
        <BreadCrumbs style={{ marginTop: 15 }} />
        <div className={styles.content}>{children}</div>
        {!bgImg && (
          <>
            <div className={styles.lightModeBox}>
              <div className={styles.lbBox}></div>
              <div className={styles.rbBox}>
                <div className={styles.sBox}></div>
                <div className={styles.xBox}></div>
              </div>
            </div>
            <div className={styles.darkModeBox}>
              <div className={styles.leftBox}></div>
              <div className={styles.rightBox}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
