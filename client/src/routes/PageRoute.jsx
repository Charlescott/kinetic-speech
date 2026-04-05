import { pages } from "../legacy/data.js";
import LegacyPage from "../legacy/LegacyPage.jsx";

export default function PageRoute({ slug, titleOverride }) {
  return <LegacyPage page={pages[slug]} titleOverride={titleOverride} />;
}
