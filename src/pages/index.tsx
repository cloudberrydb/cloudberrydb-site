import CommonLayout from "../components/common/Layout";
import BlogPosts from "../components/home/BlogPosts";
import FeatureHighlight from "../components/home/FeatureHighlight";
import HCard from "../components/home/HCard";
import JoinCommunity from "../components/home/JoinCommunity";
import WhyCloudberryDatabase from "../components/home/WhyCloudberryDatabase";
export default function Home(): JSX.Element {
  return (
    <CommonLayout>
      <HCard></HCard>
      <FeatureHighlight />
      <WhyCloudberryDatabase />
      <BlogPosts />
      <JoinCommunity />
    </CommonLayout>
  );
}
