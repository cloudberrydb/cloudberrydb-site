import { useHistory } from "@docusaurus/router";
import { throttle } from "lodash-es";
import { useEffect } from "react";

function findHighId(
  scrollPosition: number,
  scrollIdSelect: NodeListOf<HTMLElement>
) {
  let smallN = Number.MAX_SAFE_INTEGER;
  let id;
  scrollIdSelect.forEach((item) => {
    if (!item.dataset.id) return;
    const targetPosition = item.offsetTop;

    if (!targetPosition) return;
    const pod = targetPosition - scrollPosition;
    // select small pod
    if (pod > 0 && pod < smallN) {
      smallN = pod;
      id = item.dataset.id;
    }
  });
  return id;
}

export function useScrollHash() {
  const history = useHistory();
  const handleScroll = () => {
    const currentHash = window.location.hash;
    const scrollPosition = window.scrollY;
    const scrollIdSelect: NodeListOf<HTMLElement> =
      document.querySelectorAll(".scroll-id-select");
    const id = findHighId(scrollPosition, scrollIdSelect);
    if (id && "#" + id != currentHash) {
      history.replace({ hash: id });
    }
  };
  const throttleFunc = throttle(handleScroll, 10);

  useEffect(() => {
    window.addEventListener("scroll", throttleFunc);
    return () => {
      window.removeEventListener("scroll", throttleFunc);
    };
  }, []);
}
