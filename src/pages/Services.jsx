import React from "react";
import { motion } from "framer-motion";

const services = [
  {
    icon: "🎉",
    title: "Banquet Halls",
    description:
      "Host your special moments in our beautifully designed banquet spaces — perfect for weddings, conferences, receptions, corporate functions, and social gatherings. Each hall is tailored to match the mood of your event with seamless arrangements.",
    imageUrl:
      "banquet_halls.jpg",
  },
  {
    icon: "💍",
    title: "Wedding Celebrations",
    description:
      "Let your dream wedding unfold in luxury. Our expert event planners bring creativity, coordination, and class to every ceremony — turning your big day into a timeless memory.",
    imageUrl:
      "weeding_celebrations.jpg",
  },
  {
    icon: "👶",
    title: "Baby Showers",
    description:
      "Celebrate the joy of new beginnings in a warm and welcoming space. Enjoy curated baby shower setups with elegant rooms and a cozy ambiance for your loved ones to gather.",
    imageUrl:
      "baby_shower.jpeg",
  },
  {
    icon: "🎂",
    title: "Birthday Events",
    description:
      "From themed decor and music to games and personalized cakes — we create a birthday celebration that's both joyful and memorable for all age groups.",
    imageUrl:
      "birthday_events.jpg",
  },
  {
    icon: "🍽️",
    title: "Restaurant & Private Dining",
    description:
      "Delight your palate with regional and international cuisine in our elegant restaurant setting. Perfect for family dinners, ceremonies, or intimate celebrations.",
    imageUrl:
      "swaranjali3.jpg",
  },
  {
    icon: "💼",
    title: "Corporate Events",
    description:
      "Our tech-enabled venues and professional service ensure your board meetings, conferences, and corporate functions are delivered with precision and style — with 24/7 support.",
    imageUrl:
      "corporate_events.jpg",
  },
  {
    icon: "🛎️",
    title: "Premium Room Service",
    description:
      "Experience hospitality that goes beyond expectations. Our attentive staff ensures your room stays impeccable, catering to your needs throughout your stay or event.",
    imageUrl:
      "swaranjali8.avif",
  },
  {
    icon: "🎭",
    title: "Entertainment Events",
    description:
      "From engagements and anniversaries to cultural evenings and romantic dinners, we curate unforgettable entertainment experiences for every occasion.",
    imageUrl:
      "entertainment_events.jpeg",
  },
  {
    icon: "🏆",
    title: "Sports & Outdoor Events",
    description:
      "Host sports meets, fitness events, or garden parties in our spacious lawns. We provide the perfect setting with seamless setups for any outdoor event.",
    imageUrl:
      "sports_events.jpg",
  },
];

const cardVariants = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.2, duration: 0.8 },
  },
};

const Services = () => {
  return (
    <div className="overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Luxury Event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-light text-white leading-none tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Our Services
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white font-light leading-relaxed max-w-md mt-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            >
              Let's Celebrate Your Moments at Swaranjali. Unforgettable
              celebrations come to life with elegance and heartfelt hospitality.
            </motion.p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 lg:right-24">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-px h-12 bg-white opacity-60"></div>
            <div className="w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
              Let's Celebrate Your Moments
            </h2>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto font-light">
              From intimate gatherings to grand events, every detail is crafted
              with elegance, modern design, and heartfelt hospitality.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="group relative rounded-md shadow-lg overflow-hidden transform transition duration-500 hover:shadow-2xl hover:-translate-y-2 h-48 sm:h-64 md:h-80"
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.5 }}
              >
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-3 sm:p-4 md:p-8">
                  <h3 className="text-sm sm:text-lg md:text-3xl font-medium text-white mb-2 sm:mb-3 tracking-wide leading-tight">
                    {service.title}
                  </h3>
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center p-3 sm:p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white text-xs sm:text-sm leading-relaxed font-light tracking-wide flex-grow line-clamp-2 md:line-clamp-none">
                      {service.description}
                    </p>
                    <button className="mt-3 sm:mt-4 md:mt-6 inline-block px-4 py-2 sm:px-6 sm:py-2 text-white border border-amber-300 rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300 text-xs sm:text-sm font-medium">
                      Read More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
