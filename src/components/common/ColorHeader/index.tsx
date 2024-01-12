import BreadCrumbs from "../Breadcrumbs";
import styles from "./styles.module.scss";
interface IProps {
  children: React.ReactElement;
  bgImg?: string;
}
export function ColorHeader({ children, bgImg }: IProps) {
  return (
    <div
      className={styles.wrap}
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
            <div className={styles.leftBox}></div>
            <div className={styles.rightBox}></div>
          </>
        )}
      </div>
    </div>
  );
}
