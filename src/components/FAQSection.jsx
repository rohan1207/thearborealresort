import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What are the check-in and check-out timings?",
    answer:
      "Standard check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in or late check-out can be arranged on request, subject to availability.",
  },
  {
    question: "Do all rooms have forest or valley views?",
    answer:
      "Yes. Our accommodations are designed to keep you closely connected to nature, with curated views of forest landscapes and surrounding valley terrain.",
  },
  {
    question: "Is the resort suitable for couples and families?",
    answer:
      "Absolutely. The property is planned for both peaceful couple stays and comfortable family getaways, with room options and experiences suitable for both.",
  },
  {
    question: "Do you offer food and dining at the resort?",
    answer:
      "Yes. We offer in-house dining with a range of options. Our team can also help with specific meal preferences and special requests during your stay.",
  },
  {
    question: "Is parking available at the property?",
    answer:
      "Yes, guest parking is available on-site. If you need assistance with arrival or directions, our team will share the details once your booking is confirmed.",
  },
  {
    question: "How can I book and confirm my stay?",
    answer:
      "You can book directly from our website using the booking flow. For custom requirements, you can also contact us and our team will help you with the best available option.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="w-full bg-[#f5f3ed] py-12 sm:py-14 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-gray-600 font-medium">
            FAQs
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl text-gray-900 font-normal">
            Everything You Need To Know
          </h2>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="py-1">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full text-left px-1 sm:px-2 py-4 sm:py-5 flex items-center justify-between gap-4"
                >
                  <span className="text-base sm:text-lg lg:text-xl text-gray-900 font-medium leading-snug">
                    {item.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl sm:text-3xl text-gray-700 leading-none flex-shrink-0"
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-1 sm:px-2 pb-4 sm:pb-5 pr-8 sm:pr-14">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
