import { Navigate, useParams } from "react-router-dom";

export default function BlogHtmlRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

