import Link, { Props } from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
export default function LinkWithBaseUrl(props: Props) {
  const to = useBaseUrl(props.to);
  const href = useBaseUrl(props.href);
  let target = props.target;
  if (
    !target &&
    (props.to?.startsWith("http") || props.href?.startsWith("http"))
  ) {
    target = "_blank";
  }
  return <Link {...props} to={to} href={href} target={target}></Link>;
}
