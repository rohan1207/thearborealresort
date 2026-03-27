import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGlobalSEO } from "../hooks/useGlobalSEO";
import { BlogSkeleton } from "../components/SkeletonLoader";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { apiFetch } from "../utils/api";

// Helper to strip HTML tags for excerpts
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { seoSettings } = useGlobalSEO();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch('/blogs?limit=20');
      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        throw new Error(data.message || 'Failed to load blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError({
        message: err.message || 'Failed to load blogs',
        isNetworkError: err.isNetworkError || false
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "The Arboreal Journal",
    "description": "Discover travel tips, wellness insights, and the stories behind our sanctuary in the hills of Lonavala.",
    "url": `${window.location.origin}/blog`,
    "blogPost": blogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt || blog.metaDescription,
      "image": blog.coverImage,
      "datePublished": blog.createdAt,
      "author": {
        "@type": "Organization",
        "name": blog.author || "The Arboreal Resort"
      }
    }))
  };

  if (loading) {
    return <BlogSkeleton />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message}
        isNetworkError={error.isNetworkError}
        onRetry={fetchBlogs}
      />
    );
  }

  const siteUrl = seoSettings?.siteUrl || window.location.origin;
  const ogImage = seoSettings?.defaultOgImage || `${siteUrl}/slider5.webp`;
  const blogPageTitle = `Blog & Stories | ${seoSettings?.siteName || 'The Arboreal Resort, Lonavala'}`;
  const blogPageDescription = seoSettings?.defaultMetaDescription
    ? `${seoSettings.defaultMetaDescription} Read our latest blog posts about nature, luxury, and mindful living.`
    : "Discover travel tips, wellness insights, and the stories behind The Arboreal Resort in the hills of Lonavala. Read our latest blog posts about nature, luxury, and mindful living.";
  const blogPageKeywords = seoSettings?.defaultKeywords && seoSettings.defaultKeywords.length > 0
    ? [...seoSettings.defaultKeywords, 'blog', 'stories', 'travel tips', 'wellness'].join(', ')
    : "Lonavala resort blog, nature retreat stories, luxury resort blog, travel tips Lonavala, wellness blog, forest resort experiences, The Arboreal Resort blog";

  const visibleBlogs = showAll ? blogs : blogs.slice(0, 5);

  return (
    <>
      <Helmet>
        <title>{blogPageTitle}</title>
        <meta name="description" content={blogPageDescription} />
        <meta name="keywords" content={blogPageKeywords} />
        <meta property="og:title" content={blogPageTitle} />
        <meta property="og:description" content={blogPageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`${siteUrl}/blog`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPageTitle} />
        <meta name="twitter:description" content={blogPageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={`${siteUrl}/blog`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">

        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-gray-900 overflow-hidden">
          <img
            src="/slider5.webp"
            alt="The Arboreal Journal"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white/70 uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 font-light"
            >
              Stories & Insights
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white mb-4 sm:mb-6 tracking-wide"
            >
              The Arboreal Journal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-sm sm:text-base md:text-lg font-light max-w-xl sm:max-w-2xl"
            >
              Discover travel tips, wellness insights, and the stories behind our sanctuary in the hills of Lonavala.
            </motion.p>
          </div>
        </div>

        {/* Blog Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-light text-lg">
              No blogs available at the moment.
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              >
                {visibleBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id || blog.slug || index}
                    variants={itemVariants}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                  >
                    {/* Image */}
                    <Link to={`/blog/${blog.slug}`} className="block overflow-hidden aspect-[16/10]">
                      <img
                        src={blog.coverImage || '/placeholder.webp'}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3 sm:p-6">
                      <p className="text-[10px] sm:text-xs text-gray-400 font-light mb-2 sm:mb-3 uppercase tracking-wider">
                        {formatDate(blog.createdAt)} &bull; {blog.readingTime || '~5'} min read
                      </p>
                      <Link to={`/blog/${blog.slug}`}>
                        <h2 className="text-sm sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3 leading-snug group-hover:text-green-800 transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed line-clamp-3 flex-1">
                        {blog.excerpt || stripHtml(blog.metaDescription || blog.content || '').substring(0, 150) + '...'}
                      </p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="mt-3 sm:mt-4 inline-flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-green-800 hover:text-green-600 font-medium transition-colors duration-300"
                      >
                        Discover more
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* View More Button */}
              {!showAll && blogs.length > 5 && (
                <div className="flex justify-center mt-10 sm:mt-12">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-gray-900 text-white hover:bg-gray-800 rounded-full transition-all duration-300 font-light text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transform"
                  >
                    View More Blogs
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;