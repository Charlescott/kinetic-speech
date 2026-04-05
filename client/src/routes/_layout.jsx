import { Link } from "react-router-dom";

export default function Layout({ title, children }) {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <Link to="/">Kinetic Speech</Link>
        </div>
        <nav className="nav">
          <Link to="/about-us">About</Link>
          <Link to="/our-services">Services</Link>
          <Link to="/team">Team</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact-us">Contact</Link>
          <Link to="/book-appointment">Book</Link>
        </nav>
      </header>
      <main className="main">
        {title ? <h1 className="pageTitle">{title}</h1> : null}
        {children}
      </main>
      <footer className="footer">© {new Date().getFullYear()} Kinetic Speech Services, PLLC</footer>
    </div>
  );
}
