import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import blogs from "../Data/blogsdata.json";

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

  const blog = useMemo(() => {
    if (!Array.isArray(blogs)) return null;
    return blogs.find((b) => slugify(b.title) === slug) || null;
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f3ed] px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 mb-3">Blog not found</h1>
          <p className="text-gray-600 mb-6">The blog you are looking for does not exist.</p>
          <Link to="/blog" className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm">Back to Stories</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f3ed]">
      <section
        className="relative h-[42vh] sm:h-[48vh] md:h-[60vh] bg-center bg-cover flex items-end"
        style={{ backgroundImage: `url('${blog.coverImage || ""}')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 pb-8">
          <div className="mb-3">
            <Link to="/blog" className="text-white/90 text-xs tracking-[0.15em] uppercase">← Back</Link>
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
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        {(() => {
          return null;
        })()}
        {blog.metaTitle && (
          <h2 className="sr-only">{blog.metaTitle}</h2>
        )}
        {blog.metaDescription && (
          <p className="sr-only">{blog.metaDescription}</p>
        )}

        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full rounded-xl shadow-md mb-8 block md:hidden"
          />
        )}

        {(() => {
          const blocks = (blog.content || "")
            .split(/\n\s*\n/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((b) => {
              const len = b.length;
              const hasPeriod = /[.!?]/.test(b);
              const hasColonOrDash = /[:–—]/.test(b);
              const words = b.split(/\s+/);
              const capWords = words.filter((w) => /^[A-Z][a-z]/.test(w.replace(/[^A-Za-z]/g, ""))).length;
              const capRatio = words.length ? capWords / words.length : 0;
              if (len <= 100 && !hasPeriod && (capRatio >= 0.5 || words.length <= 8)) return { type: "h2", text: b };
              if (len <= 160 && hasColonOrDash) return { type: "h3", text: b };
              return { type: "p", text: b };
            });

          return (
            <article className="text-gray-800 leading-relaxed">
              {blocks.map((blk, i) => {
                if (blk.type === "h2")
                  return (
                    <h2 key={i} className="mt-8 mb-3 text-2xl sm:text-3xl font-serif text-gray-900">
                      {blk.text}
                    </h2>
                  );
                if (blk.type === "h3")
                  return (
                    <h3 key={i} className="mt-6 mb-2 text-xl sm:text-2xl font-serif text-gray-900">
                      {blk.text}
                    </h3>
                  );
                return (
                  <p key={i} className="whitespace-pre-line text-[15px] sm:text-base font-light text-gray-800 mb-4">
                    {blk.text}
                  </p>
                );
              })}
            </article>
          );
        })()}

        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">Written by {blog.author || "The Arboreal Resort"}</div>
          <Link to="/blog" className="text-sm text-gray-900 underline underline-offset-4">All stories</Link>
        </div>
      </main>
    </div>
  );
};

export default BlogDetail;
