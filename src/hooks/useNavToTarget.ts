import { useHistory } from "@docusaurus/router";

export default function useNavToTarget() {
  const history = useHistory();
  return (
    url: string,
    target: "_blank" | "_self" = "_self",
    isWindowOpen = false
  ) => {
    if (isWindowOpen) {
      window.open(url, target);
    } else if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      history.push(url, target);
    }
  };
}
