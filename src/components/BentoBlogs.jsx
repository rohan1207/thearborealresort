import React, { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import blogsData from "../Data/blogsdata.json";

const BentoBlogs = memo(() => {
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

  const blogs = blogsData.map((b, i) => ({
    id: i + 1,
    category: (b.author || "Story").toUpperCase(),
    title: b.title,
    description: excerpt(b.content, 36),
    image: b.coverImage,
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
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f5f3ed]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif italic text-gray-600 text-base sm:text-lg md:text-xl mb-2 sm:mb-3"
          >
            Stories & Insights
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 font-normal"
          >
            Discover Arboreal
          </motion.h2>
        </div>

        {/* Bento Grid - Mobile: 2 columns, Desktop: Bento layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
        >
          {/* First Row - 3 Small Cards (Mobile: Show only first 4 blogs) */}
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.article
              key={blog.id}
              variants={itemVariants}
              className={`group relative overflow-hidden bg-transparent  hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl md:rounded-2xl ${
                index >= 2 ? 'hidden md:block' : ''
              }`}
            >
              {/* Image */}
              <Link to={blog.link} className="block relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    style={{ willChange: 'transform' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </Link>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-[240px] sm:h-[260px] md:h-[280px]">
                <div>
                  <span className="inline-block px-2.5 sm:px-3 py-1 bg-gray-100 rounded-full text-xs tracking-[0.2em] text-gray-700 font-medium uppercase mb-3 sm:mb-4">
                    {blog.category}
                  </span>
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
          {/* Second Row - 1 Large Card + 1 Medium Card (Hidden on mobile, shown on desktop) */}
          <motion.article
            variants={itemVariants}
            className="group relative overflow-hidden  md:col-span-2 hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl md:rounded-2xl hidden md:flex flex-col h-full"
          >
            {/* Image */}
            <div className="flex-1 overflow-hidden">
              <Link to={blogs[3].link} className="block relative overflow-hidden h-full">
                <div className="h-full w-full">
                  <motion.img
                    src={blogs[3].image}
                    alt={blogs[3].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </Link>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-[240px] sm:h-[260px] md:h-[280px]">
              <div>
                <span className="inline-block px-2.5 sm:px-3 py-1 bg-gray-100 rounded-full text-xs tracking-[0.2em] text-gray-700 font-medium uppercase mb-3 sm:mb-4">
                  {blogs[3].category}
                </span>
                <Link to={blogs[3].link} className="group/title block mb-2 sm:mb-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-gray-900 group-hover/title:text-gray-600 transition-colors duration-300 leading-tight line-clamp-2">
                    {blogs[3].title}
                  </h3>
                </Link>
                <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base mb-4 sm:mb-5 max-w-3xl line-clamp-2">
                  {blogs[3].description}
                </p>
              </div>
              <div className="mt-auto ml-auto">
                <Link
                  to={blogs[3].link}
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

          <motion.article
            variants={itemVariants}
            className="group relative overflow-hidden  hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl md:rounded-2xl hidden md:flex flex-col h-full"
          >
            {/* Image */}
            <div className="flex-1 overflow-hidden">
              <Link to={blogs[4].link} className="block relative overflow-hidden h-full">
                <div className="h-full w-full">
                  <motion.img
                    src={blogs[4].image}
                    alt={blogs[4].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </Link>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-[240px] sm:h-[260px] md:h-[280px]">
              <div>
                <span className="inline-block px-2.5 sm:px-3 py-1 bg-gray-100 rounded-full text-xs tracking-[0.2em] text-gray-700 font-medium uppercase mb-3 sm:mb-4">
                  {blogs[4].category}
                </span>
                <Link to={blogs[4].link} className="group/title block mb-2 sm:mb-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-gray-900 group-hover/title:text-gray-600 transition-colors duration-300 leading-tight line-clamp-2">
                    {blogs[4].title}
                  </h3>
                </Link>
                <p className="text-gray-600 leading-relaxed font-light text-sm mb-4 sm:mb-5 line-clamp-3">
                  {blogs[4].description}
                </p>
              </div>
              <div className="mt-auto ml-auto">
                <Link
                  to={blogs[4].link}
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
        </motion.div>

        {/* View More Button - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center mt-8 md:hidden"
        >
          <a href="/blog">
            <button className="group relative px-6 py-2.5 overflow-hidden rounded-full">
              {/* Button Text */}
              <span className="relative z-10 text-xs tracking-[0.15em] text-gray-900 font-light uppercase transition-colors duration-300 group-hover:text-white">
                View More Stories
              </span>

              {/* Bottom Border */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-900"></div>

              {/* Hover Background */}
              <div className="absolute inset-0 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
});

BentoBlogs.displayName = 'BentoBlogs';

export default BentoBlogs;