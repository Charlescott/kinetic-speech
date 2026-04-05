import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { blogContent, getBlogPostBySlug } from "../content/blog.js";
import { setTitleAndDescription } from "../lib/seo.js";
import Layout from "./_layout.jsx";
import NotFound from "./NotFound.jsx";

function formatBlogDate(dateString, formatOptions) {
  return new Intl.DateTimeFormat("en-US", formatOptions).format(new Date(dateString));
}

function renderPostBlock(block) {
  if (block.type === "paragraphs") {
    return (
      <div className="blogPostSection blogPostSection--paragraphs">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <section className="blogPostSection blogPostCallout">
        <h2>{block.title}</h2>
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === "gallery") {
    return (
      <section className="blogPostSection">
        <div className="blogPostGallery">
          {block.items.map((item) => (
            <figure key={item.src} className="blogPostGallery__item">
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "toyList") {
    return (
      <section className="blogPostSection">
        <div className="blogToyGrid">
          {block.items.map((item) => (
            <article key={item.title} className="blogToyCard">
              <img src={item.image} alt="" className="blogToyCard__image" loading="lazy" />
              <div className="blogToyCard__body">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "definitions") {
    return (
      <section className="blogPostSection">
        <div className="blogDefinitionList">
          {block.items.map((item) => (
            <article key={item.term} className="blogDefinitionCard">
              <h2>{item.term}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  useEffect(() => {
    if (!post) return;

    setTitleAndDescription({
      title: `${post.title} | Kinetic Speech Services, PLLC`,
      description: post.excerpt,
    });
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  const relatedPosts = blogContent.posts.filter((entry) => entry.slug !== post.slug).slice(0, 2);

  return (
    <Layout>
      <article className="blogPost">
        <section className="blogPostHero pageSection">
          <Link to="/blog" className="blogPostHero__back">
            Back to Blog
          </Link>

          <div className="blogPostHero__grid">
            <div className="blogPostHero__content">
              <p className="pageEyebrow">Blog Post</p>
              <p className="blogMeta blogMeta--hero">
                <span>{formatBlogDate(post.date, { month: "long", day: "numeric", year: "numeric" })}</span>
                <span>{post.author}</span>
              </p>
              <h1 className="blogPostHero__title">{post.title}</h1>
              <p className="blogPostHero__excerpt">{post.excerpt}</p>
            </div>

            <div className="blogPostHero__imageWrap">
              <img src={post.image} alt="" className="blogPostHero__image" />
            </div>
          </div>
        </section>

        <section className="blogPostBody pageSection">
          <div className="blogPostBody__content">
            {post.body.map((block, index) => (
              <div key={`${post.slug}-${block.type}-${index}`}>{renderPostBlock(block)}</div>
            ))}
          </div>
        </section>

        <section className="blogRelated pageSection">
          <div className="blogRelated__header">
            <p className="pageEyebrow">More to Explore</p>
            <h2 className="blogRelated__title">Keep reading</h2>
          </div>

          <div className="blogRelated__grid">
            {relatedPosts.map((entry) => (
              <article key={entry.slug} className="blogRelatedCard">
                <img src={entry.image} alt="" className="blogRelatedCard__image" loading="lazy" />
                <div className="blogRelatedCard__body">
                  <p className="blogMeta">
                    <span>{formatBlogDate(entry.date, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>{entry.author}</span>
                  </p>
                  <h3>{entry.title}</h3>
                  <p className="blogRelatedCard__excerpt">{entry.excerpt}</p>
                  <Link to={`/blog/${entry.slug}`} className="siteButton siteButton--secondary">
                    Read Post
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
      </article>
    </Layout>
  );
}
