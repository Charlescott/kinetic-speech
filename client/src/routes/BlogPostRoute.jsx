import { useParams } from "react-router-dom";
import { blogPosts } from "../legacy/data.js";
import LegacyPage from "../legacy/LegacyPage.jsx";

export default function BlogPostRoute() {
  const { slug } = useParams();
  return <LegacyPage page={blogPosts[`/blog/${slug}`]} />;
}
