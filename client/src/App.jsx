import { Navigate, Route, Routes } from "react-router-dom";
import About from "./routes/About.jsx";
import Blog from "./routes/Blog.jsx";
import BlogHtmlRedirect from "./routes/BlogHtmlRedirect.jsx";
import BlogPost from "./routes/BlogPost.jsx";
import Book from "./routes/Book.jsx";
import Contact from "./routes/Contact.jsx";
import Cart from "./routes/Cart.jsx";
import Home from "./routes/Home.jsx";
import NotFound from "./routes/NotFound.jsx";
import Services from "./routes/Services.jsx";
import Team from "./routes/Team.jsx";

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

      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/our-services" element={<Services />} />
      <Route path="/our-services-1" element={<Navigate to="/our-services" replace />} />
      <Route path="/team" element={<Team />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/book-appointment" element={<Book />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
