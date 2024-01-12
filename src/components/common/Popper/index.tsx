import { createPopper } from "@popperjs/core";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
interface IProps {
  children: React.ReactNode;
  content: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export default function Popper(props: IProps) {
  const targetRef = useRef();
  const contentRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    createPopper(targetRef.current, contentRef.current, {
      placement: "bottom",
      modifiers: [],
    });
  }, []);
  return (
    <>
      <div
        className="popper-target"
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </div>
      <div ref={contentRef} className={styles.contentRef}>
        <div
          className={clsx(styles.popperContent, {
            [styles.isOpen]: isOpen,
          })}
        >
          <span>{props.content}</span>
          <div className={styles.arrow}></div>
        </div>
      </div>
    </>
  );
}
