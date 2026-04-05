import { useParams } from "react-router-dom";
import LegacyIframe from "../legacy/LegacyIframe.jsx";

export default function BlogPost() {
  const { slug } = useParams();
  return <LegacyIframe title="Blog Post" src={`/legacy-preview/www.kineticspeech.com/blog/${slug}.html`} />;
}
