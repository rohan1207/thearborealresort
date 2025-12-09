import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import blogsData from "../Data/blogsdata.json";

const BlogPage = () => {
  const [showAll, setShowAll] = useState(false);

  const slugify = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const excerpt = (text, n = 40) => {
    const clean = (text || "").replace(/\n+/g, " ").trim();
    const words = clean.split(/\s+/);
    const cut = words.slice(0, n).join(" ");
    return words.length > n ? `${cut}…` : cut;
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

  const readingTime = (text) => {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  const blogs = (blogsData || []).map((b, i) => ({
    id: i + 1,
    category: (b.author || "Story").toUpperCase(),
    title: b.title,
    description: excerpt(b.content, 36),
    image: b.coverImage,
    date: formatDate(b.createdAt),
    readTime: readingTime(b.content),
    link: `/blog/${slugify(b.title)}`,
  }));

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

  return (
    <div className="bg-[#f5f3ed]">
      {/* Hero Section */}
      <motion.section
        className="relative h-[50vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: "url('/slider5.webp')",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        <div className="relative text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <motion.p
            className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/90 mb-3 sm:mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stories & Insights
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-4 sm:mb-5 md:mb-6 px-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The Arboreal Journal
          </motion.h1>
          <motion.p
            className="text-xs sm:text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-2xl mx-auto px-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover travel tips, wellness insights, and the stories behind our
            sanctuary in the hills of Lonavala.
          </motion.p>
        </div>
      </motion.section>

      {/* Bento Grid Blog Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          >
            {/* Display first 4 blogs or all blogs based on showAll state */}
            {(showAll ? blogs : blogs.slice(0, 5)).map((blog, index) => (
              <motion.article
                key={blog.id}
                variants={itemVariants}
                className={`group relative overflow-hidden bg-transparent hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl md:rounded-2xl ${
                  !showAll && index >= 2 ? 'hidden md:block' : ''
                }`}
              >
                {/* Image */}
                <Link to={blog.link} className="block relative overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </Link>

                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-[240px] sm:h-[260px] md:h-[280px]">
                  <div>
                    
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <Link to={blog.link} className="group/title block mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-gray-900 group-hover/title:text-gray-600 transition-colors duration-300 leading-tight line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 leading-relaxed font-light text-sm mb-4 sm:mb-5 line-clamp-3">
                      {blog.description}
                    </p>
                  </div>
                  <div className="mt-auto ml-auto">
                    <Link
                      to={blog.link}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.15em] text-gray-900 font-medium uppercase group/link"
                    >
                      <span className="relative">
                        Discover more
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-900"></span>
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-600 group-hover/link:w-full transition-all duration-500"></span>
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
              </motion.article>
            ))}
          </motion.div>

          {/* View More Button */}
          {!showAll && blogs.length > 4 && (
            <motion.div 
              className="text-center mt-8 sm:mt-10 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={() => setShowAll(true)}
                className="px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-gray-900 text-white hover:bg-gray-800 rounded-full transition-all duration-300 font-light text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                View More Blogs
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light mb-3 sm:mb-4 px-2">
              Subscribe to Our Journal
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Receive the latest stories, travel tips, and exclusive offers
              directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto px-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-transperent/10 border border-white/20 rounded-full text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-transperent text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 font-light text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default BlogPage;