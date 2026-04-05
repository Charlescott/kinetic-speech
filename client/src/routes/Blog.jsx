import { useEffect } from "react";
import { Link } from "react-router-dom";
import { blogContent } from "../content/blog.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";

function formatBlogDate(dateString, formatOptions) {
  return new Intl.DateTimeFormat("en-US", formatOptions).format(new Date(dateString));
}

export default function Blog() {
  useEffect(() => {
    setTitleAndDescription({
      title: "Blog | Kinetic Speech Services, PLLC",
      description:
        "Read updates from Kinetic Speech Services, including aphasia-friendly events, pediatric therapy recommendations, and speech-language resources.",
    });
  }, []);

  return (
    <Layout>
      <section className="blogHero pageSection">
        <div className="blogHero__heading">
          <p className="pageEyebrow">{blogContent.eyebrow}</p>
          <h1 className="blogHero__title">{blogContent.title}</h1>
          <p className="blogHero__description">{blogContent.description}</p>
        </div>
      </section>

      <section className="blogList pageSection">
        <div className="blogGrid">
          {blogContent.posts.map((post) => (
            <article key={post.slug} className="blogCard">
              <Link to={`/blog/${post.slug}`} className="blogCard__media" aria-label={`Read ${post.title}`}>
                <img src={post.image} alt="" className="blogCard__image" loading="lazy" />
              </Link>

              <div className="blogCard__body">
                <p className="blogMeta">
                  <span>{formatBlogDate(post.date, { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span>{post.author}</span>
                </p>

                <h2 className="blogCard__title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="blogCard__excerpt">{post.excerpt}</p>

                <Link to={`/blog/${post.slug}`} className="siteButton siteButton--secondary">
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="homeCta">
        <h2>{blogContent.cta.title}</h2>
        <p>{blogContent.cta.description}</p>
        <Link to={blogContent.cta.buttonHref} className="siteButton">
          {blogContent.cta.buttonLabel}
        </Link>
      </section>
    </Layout>
  );
}
