import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../utils/api";

// Helper to strip HTML tags for excerpts
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const BentoBlogs = memo(() => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use apiFetch for caching and better error handling
      const data = await apiFetch("/blogs?limit=5&status=published");
      if (data.success) {
        const blogsData = data.blogs || [];
            setBlogs(blogsData);
      } else {
        throw new Error(data.message || 'Failed to load blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs for BentoBlogs:', err);
      setError(err);
      // Don't show error UI, just use empty array so section doesn't break homepage
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

    fetchBlogs();
  }, []);

  const excerpt = (text, n = 40) => {
    const clean = (text || "").replace(/\n+/g, " ").trim();
    const words = clean.split(/\s+/);
    const cut = words.slice(0, n).join(" ");
    return words.length > n ? `${cut}…` : cut;
  };

  // Map backend blogs to component format
  const mappedBlogs = blogs.map((blog) => ({
    id: blog._id || blog.id,
    category: (blog.category || blog.author || "Story").toUpperCase(),
    title: blog.title,
    description: excerpt(blog.excerpt || stripHtml(blog.metaDescription || blog.content || ''), 36),
    image: blog.coverImage,
    link: `/blog/${blog.slug}`,
    slug: blog.slug,
  }));

  // We intentionally keep this component free of Framer Motion animations
  // to reduce scroll jank when combined with Lenis smooth scrolling.

  // Don't render if loading or no blogs (fail silently to not break homepage)
  if (loading || mappedBlogs.length === 0) {
    return null; // Return null instead of showing loading/error to keep homepage clean
  }

  return (
    <section 
      className="py-12 sm:py-14 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f5f3ed]"
      style={{
        transform: 'translateZ(0)',
        willChange: 'auto',
        contentVisibility: 'auto',
        contain: 'layout style paint',
        containIntrinsicSize: '800px 800px',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <p
            className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6B6B6B] font-normal mb-2 sm:mb-3"
            style={{ transform: 'translateZ(0)' }}
          >
            Stories & Insights
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] font-normal leading-tight"
            style={{ transform: 'translateZ(0)' }}
          >
            Discover Arboreal
          </h2>
        </div>

        {/* Bento Grid - two rows, up to 5 cards, all same size */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          style={{ 
            willChange: 'auto',
            transform: 'translateZ(0)', // GPU acceleration
          }}
        >
          {/* Show up to 5 blogs in a simple, uniform grid */}
          {mappedBlogs.slice(0, 5).map((blog, index) => (
            <article
              key={blog.id}
              className={`group relative overflow-hidden border border-black/10 transition-all duration-500 hover:shadow-xl ${
                index >= 2 ? 'hidden md:block' : ''
              }`}
              style={{ 
                transform: 'translateZ(0)', // GPU acceleration
                willChange: 'auto',
                contain: 'layout style paint', // CSS containment
              }}
            >
              {/* Image */}
              <Link to={blog.link} className="block relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "low"}
                    style={{ willChange: 'transform' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </Link>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-[240px] sm:h-[260px] md:h-[280px]">
                <div>
                  <span className="inline-block px-2.5 sm:px-3 py-1 border border-[#1a1a1a]/20 rounded-full text-[10px] sm:text-xs tracking-[0.2em] text-[#6B6B6B] font-medium uppercase mb-3 sm:mb-4">
                    {blog.category}
                  </span>
                  <Link to={blog.link} className="group/title block mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl text-[#1a1a1a] font-normal group-hover/title:text-[#2a2a2a] transition-colors duration-300 leading-tight line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-[#6B6B6B] leading-relaxed font-normal text-sm mb-4 sm:mb-5 line-clamp-3">
                    {blog.description}
                  </p>
                </div>
                <div className="mt-auto ml-auto">
                  <Link
                    to={blog.link}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 sm:px-5 py-2 text-[10px] sm:text-xs tracking-[0.16em] text-white font-medium uppercase hover:bg-[#000000] transition-all duration-300 group/link"
                  >
                    <span>
                      Read
                    </span>
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover/link:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
              </div>

        {/* View All Blogs Button */}
        <div
          className="flex justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-16"
          style={{ transform: 'translateZ(0)', willChange: 'opacity, transform' }}
        >
          <Link to="/blog">
            <button className="group relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#1a1a1a] transition-all duration-300 hover:bg-[#000000]">
              <span className="relative z-10 text-xs sm:text-sm tracking-[0.18em] text-white font-medium uppercase transition-colors duration-300">
                View All Blogs
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
});

BentoBlogs.displayName = 'BentoBlogs';

export default BentoBlogs;