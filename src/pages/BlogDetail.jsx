import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GenericSkeleton } from "../components/SkeletonLoader";
import { apiFetch } from "../utils/api";

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/blogs/${slug}`);
      
      if (data.success && data.blog) {
        setBlog(data.blog);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f5f3ed] min-h-screen flex items-center justify-center">
        <GenericSkeleton lines={5} className="max-w-4xl w-full px-4" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f3ed] px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 mb-3">
            {error || "Blog not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The blog you are looking for does not exist.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 sm:px-6 py-2 text-xs sm:text-sm tracking-[0.16em] text-white font-medium uppercase hover:bg-[#000000] transition-all duration-300"
          >
            <span>Back to Stories</span>
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = blog.structuredData || {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.metaTitle || blog.title,
    "description": blog.metaDescription || blog.excerpt,
    "image": blog.coverImage,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": {
      "@type": "Organization",
      "name": blog.author || "The Arboreal Resort"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Arboreal Resort",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${blog.slug}`
    }
  };

  // Content is now HTML from TinyMCE, so we'll render it directly
  const canonicalUrl = blog.canonicalUrl || `${window.location.origin}/blog/${blog.slug}`;
  const ogImage = blog.ogImage || blog.coverImage;

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title} | The Arboreal Resort</title>
        <meta
          name="description"
          content={blog.metaDescription || blog.excerpt || blog.title}
        />
        {blog.seoKeywords && blog.seoKeywords.length > 0 && (
          <meta name="keywords" content={blog.seoKeywords.join(", ")} />
        )}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta
          property="og:description"
          content={blog.metaDescription || blog.excerpt || blog.title}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${window.location.origin}/blog/${blog.slug}`} />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt || blog.createdAt} />
        <meta property="article:author" content={blog.author || "The Arboreal Resort"} />
        {blog.tags && blog.tags.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta
          name="twitter:description"
          content={blog.metaDescription || blog.excerpt || blog.title}
        />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="bg-[#f5f3ed]">
        <section
          className="relative h-[42vh] sm:h-[48vh] md:h-[60vh] bg-center bg-cover flex items-end"
          style={{ backgroundImage: `url('${blog.coverImage || ""}')` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 pb-8">
            <div className="mb-3">
              <Link
                to="/blog"
                className="text-white/90 text-xs tracking-[0.15em] uppercase hover:text-white"
              >
                ← Back
              </Link>
            </div>
            <h1 className="text-white font-serif font-light text-3xl sm:text-4xl md:text-5xl leading-tight">
              {blog.title}
            </h1>
            <div className="mt-3 text-white/90 text-xs sm:text-sm flex flex-wrap gap-3">
              <span>{blog.author || "The Arboreal Resort"}</span>
              {blog.createdAt && (
                <>
                  <span>•</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </>
              )}
              {blog.readingTime && (
                <>
                  <span>•</span>
                  <span>{blog.readingTime} min read</span>
                </>
              )}
            </div>
          </div>
        </section>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full rounded-xl shadow-md mb-8 block md:hidden"
            />
          )}

          <article 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed
              prose-headings:font-serif prose-headings:text-gray-900
              prose-p:text-[15px] prose-p:sm:text-base prose-p:font-light prose-p:mb-4
              prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:md:text-5xl prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-6 prose-h3:mb-2
              prose-ul:list-disc prose-ol:list-decimal
              prose-a:text-[#006D5B] prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-medium
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-600 tracking-[0.12em] uppercase">
              Written by {blog.author || "The Arboreal Resort"}
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 sm:px-6 py-2 text-xs sm:text-sm tracking-[0.16em] text-white font-medium uppercase hover:bg-[#000000] transition-all duration-300"
            >
              <span>All Stories</span>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogDetail;
