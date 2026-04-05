import { Navigate, Route, Routes } from "react-router-dom";
import LegacyPreview from "./routes/LegacyPreview.jsx";
import BlogHtmlRedirect from "./routes/BlogHtmlRedirect.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/about-us.html" element={<Navigate to="/about-us" replace />} />
      <Route path="/our-services-1.html" element={<Navigate to="/our-services" replace />} />
      <Route path="/contact-us.html" element={<Navigate to="/contact-us" replace />} />
      <Route path="/book-appointment.html" element={<Navigate to="/book-appointment" replace />} />
      <Route path="/team.html" element={<Navigate to="/team" replace />} />
      <Route path="/blog.html" element={<Navigate to="/blog" replace />} />
      <Route path="/blog572f.html" element={<Navigate to="/blog" replace />} />
      <Route path="/blog572f" element={<Navigate to="/blog" replace />} />
      <Route path="/blog/:slug.html" element={<BlogHtmlRedirect />} />
      <Route path="/cart.html" element={<Navigate to="/cart" replace />} />

      <Route path="/*" element={<LegacyPreview />} />
    </Routes>
  );
}
