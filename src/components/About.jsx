import React from "react";
import { motion } from "framer-motion";
import { useAboutSettings } from "../hooks/useAboutSettings";

const About = () => {
  const { settings } = useAboutSettings();

  const card1 = settings?.cards?.[0];
  const card2 = settings?.cards?.[1];

  const isValidCloudinaryUrl = (url) =>
    typeof url === "string" &&
    url.includes("res.cloudinary.com") &&
    url.includes("dnztpad6y");

  // Fallback to current static content if backend not available
  const card1Title = card1?.title || "History of The Arboreal Resort";
  const card1Desc1 =
    card1?.description1 ||
    "Welcome to The Arboreal Resort in Gevhande, Apti, Lonavala — a serene escape tucked at the foothills of the Western Ghats. Designed as a luxurious yet eco-friendly retreat, our resort is surrounded by lush greenery, tranquil hills, and an abundance of flora and fauna.";
  const card1Desc2 =
    card1?.description2 ||
    "Here, you'll find more than just a stay. With an outdoor pool, a multi-cuisine restaurant, and curated activities, we bring you closer to nature while ensuring modern comforts. Whether it's trekking, bird watching, or a rejuvenating yoga session, every moment is crafted to help you reconnect with yourself and the world around you.";
  // Prefer images from the correct Cloudinary cloud; otherwise use local fallbacks
  const card1Image =
    (card1?.imageUrl && isValidCloudinaryUrl(card1.imageUrl)) || "/slider23.webp";

  const card2Title = card2?.title || "Why Choose Us?";
  const card2Desc1 =
    card2?.description1 ||
    "At The Arboreal Resort, every detail is built to give you the perfect getaway. Our spacious, modern rooms come with private balconies offering panoramic views of the misty hills. Imagine mornings where you wake up to the melody of chirping birds, rustling trees, and cool breezes drifting through your window.";
  const card2Desc2 =
    card2?.description2 ||
    "Whether you're here for adventure or relaxation, we've got something for everyone. From nature walks and meditation to poolside leisure and fine dining, we ensure your experience is both indulgent and unforgettable. For those seeking the best rainforest resort in Lonavala, Arboreal is where nature and luxury meet in harmony.";
  const card2Image =
    (card2?.imageUrl && isValidCloudinaryUrl(card2.imageUrl)) || "/ac2.webp";

  return (
    <div className="bg-[#f5f3ed] py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-5 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* About Us Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="h-px w-8 sm:w-10 md:w-12 bg-gray-400"></div>
            <p className="text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-gray-600 uppercase">
              About Us
            </p>
            <div className="h-px w-8 sm:w-10 md:w-12 bg-gray-400"></div>
          </div>
        </motion.div>

        {/* Section 1: History of The Arboreal Resort */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-6 md:border-8 border-white">
              <img
                src={card1Image}
                alt="Arboreal Resort at Night"
                className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-3 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-4 sm:mb-5 md:mb-6">
              {card1Title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
              {card1Desc1}
            </p>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
              {card1Desc2}
            </p>
          </motion.div>
        </div>

        {/* Section 2: Why Choose Us? */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-4 sm:mb-5 md:mb-6">
              {card2Title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
              {card2Desc1}
            </p>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
              {card2Desc2}
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 sm:border-6 md:border-8 border-white">
              <img
                src={card2Image}
                alt="Resort Deck View"
                className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
