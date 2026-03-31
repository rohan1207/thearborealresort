import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from "react-icons/fi";
import { useGlobalSEO } from "../hooks/useGlobalSEO";
import { useContactSettings, redirectToWhatsApp } from "../hooks/useContactSettings";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSubmitStatus(null);
  };

  const { contactSettings } = useContactSettings();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!contactSettings?.formEnabled) {
      alert('Contact form is currently disabled. Please contact us directly.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message. Please try again.');
      }

      setSubmitStatus('success');

      // If WhatsApp is configured and enabled, also open WhatsApp with the same message (existing behaviour)
      if (contactSettings?.sendToWhatsApp && contactSettings?.whatsappNumber) {
        let whatsappMessage = contactSettings.whatsappMessageTemplate ||
          '*New Contact Form Submission*\n\n*Name:* {name}\n*Email:* {email}\n*Phone:* {phone}\n*Subject:* {subject}\n\n*Message:*\n{message}';
        whatsappMessage = whatsappMessage
          .replace(/{name}/g, formData.name || 'Not provided')
          .replace(/{email}/g, formData.email || 'Not provided')
          .replace(/{phone}/g, formData.phone || 'Not provided')
          .replace(/{subject}/g, formData.subject || 'Not provided')
          .replace(/{message}/g, formData.message || 'Not provided');
        redirectToWhatsApp(contactSettings.whatsappNumber, whatsappMessage);
      }

      // Clear form after success
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
      alert(err.message || 'Something went wrong. Please try again or contact us directly.');
    } finally {
      setSending(false);
    }
  };

  // Build contact info from database (with fallback defaults)
  const getContactInfo = () => {
    if (!contactSettings) {
      // Default values while loading
      return [
        {
          icon: <FiMapPin className="w-6 h-6" />,
          title: "Visit Us",
          details: ['The Arboreal, Pvt. Road,', 'Gevhande Apati, Lonavala,', 'Maharashtra 412108'],
          link: 'https://maps.app.goo.gl/2EL8NXUZgh4An2NL8',
        },
        {
          icon: <FiPhone className="w-6 h-6" />,
          title: "Call Us",
          details: ['+91 8065423948  *(+91 is essential)'],
          link: 'tel:+918065423948',
        },
        {
          icon: <FiMail className="w-6 h-6" />,
          title: "Email Us",
          details: ['reservations@thearborealresort.com'],
          link: 'mailto:reservations@thearborealresort.com',
        },
        {
          icon: <FiClock className="w-6 h-6" />,
          title: "Working Hours",
          details: ['24/7 Reception', 'Always Available'],
          link: null,
        },
      ];
    }

    return [
      {
        icon: <FiMapPin className="w-6 h-6" />,
        title: "Visit Us",
        details: contactSettings.address ? contactSettings.address.split(',').map(s => s.trim()).filter(Boolean) : [],
        link: contactSettings.addressLink || null,
      },
      {
        icon: <FiPhone className="w-6 h-6" />,
        title: "Call Us",
        details: [contactSettings.phoneDisplay || contactSettings.phone || ''],
        link: contactSettings.phone ? `tel:${contactSettings.phone.replace(/\s/g, '')}` : null,
      },
      {
        icon: <FiMail className="w-6 h-6" />,
        title: "Email Us",
        details: [contactSettings.email || ''],
        link: contactSettings.email ? `mailto:${contactSettings.email}` : null,
      },
      {
        icon: <FiClock className="w-6 h-6" />,
        title: "Working Hours",
        details: contactSettings.workingHours ? contactSettings.workingHours.split(',').map(s => s.trim()).filter(Boolean) : [],
        link: null,
      },
    ];
  };

  const contactInfo = getContactInfo();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const { seoSettings } = useGlobalSEO();
  const siteUrl = seoSettings?.siteUrl || window.location.origin;
  const ogImage = seoSettings?.defaultOgImage || `${siteUrl}/slider5.webp`;
  const pageTitle = `Contact Us | ${seoSettings?.siteName || 'The Arboreal Resort'}`;
  const pageDescription = `Get in touch with ${seoSettings?.siteName || 'The Arboreal Resort'}. Contact us for reservations, inquiries, or to plan your perfect stay in Lonavala.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {seoSettings?.defaultKeywords && seoSettings.defaultKeywords.length > 0 && (
          <meta name="keywords" content={seoSettings.defaultKeywords.join(', ') + ', contact, reservations, booking'} />
        )}
        <link rel="canonical" href={`${siteUrl}/contact`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/contact`} />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="bg-[#f5f3ed]">
        {/* Hero Section */}
        <motion.section
          className="relative h-[50vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80')",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
          <div className="relative text-center px-4 sm:px-6 max-w-4xl mx-auto">
            <motion.p
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90 mb-3 sm:mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Get in Touch
            </motion.p>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-4 sm:mb-5 md:mb-6 px-2 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base text-[#f3f3f3] font-normal leading-relaxed max-w-2xl mx-auto px-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We're here to help you create unforgettable moments. Reach out to us
              for inquiries, reservations, and any assistance you may need.
            </motion.p>
          </div>
        </motion.section>

      {/* Contact Information Cards */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-xl sm:rounded-2xl border border-black/10"
              >
                <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-[#2a2a2a]/95 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                  {React.cloneElement(info.icon, {
                    className: "w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6",
                  })}
                </div>
                <h3 className="text-base sm:text-lg font-serif text-gray-900 mb-3 sm:mb-4 font-light">
                  {info.title}
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-xs sm:text-sm text-[#6B6B6B] font-normal break-words">
                      {detail}
                    </p>
                  ))}
                </div>
                {info.link && (
                  <a
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 sm:mt-5 md:mt-6 rounded-full bg-[#1a1a1a] px-4 sm:px-5 py-2 text-[10px] sm:text-xs tracking-[0.16em] text-white font-medium uppercase hover:bg-[#000000] transition-all duration-300 group/link"
                  >
                    <span>
                      {info.title === "Visit Us"
                        ? "Get Directions"
                        : info.title === "Call Us"
                        ? "Call Now"
                        : info.title === "Email Us"
                        ? "Send Email"
                        : ""}
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
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="pb-10 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-xl rounded-2xl sm:rounded-3xl border border-black/10"
          >
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="inline-block p-2.5 sm:p-3 bg-gray-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                <FiSend className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-gray-900 mb-2 sm:mb-3 leading-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] font-normal">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-700 mb-1.5 sm:mb-2 font-medium"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2a2a2a] focus:border-transparent transition-all duration-300 text-xs sm:text-sm font-normal bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-700 mb-1.5 sm:mb-2 font-medium"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-xs sm:text-sm font-normal bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-700 mb-1.5 sm:mb-2 font-medium"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-xs sm:text-sm font-normal bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-700 mb-1.5 sm:mb-2 font-medium"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Reservation Inquiry"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 text-xs sm:text-sm font-normal bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-700 mb-1.5 sm:mb-2 font-medium"
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2a2a2a] focus:border-transparent transition-all duration-300 text-xs sm:text-sm font-normal resize-none bg-gray-50 focus:bg-white"
                ></textarea>
              </div>
              {submitStatus === 'success' && (
                <p className="text-xs sm:text-sm text-green-600 font-medium">
                  Message sent successfully. We&apos;ll get back to you soon.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-xs sm:text-sm text-red-600 font-medium">
                  Failed to send. Please try again or contact us directly.
                </p>
              )}
              <div>
                <motion.button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#1a1a1a] hover:bg-[#000000] text-white font-medium py-3 sm:py-3.5 md:py-4 px-6 sm:px-7 md:px-8 rounded-full transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-[0.18em] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={sending ? {} : { scale: 1.02 }}
                  whileTap={sending ? {} : { scale: 0.98 }}
                >
                  <FiSend className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-xl overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100"
          >
            <div className="h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6740519416508!2d73.42024677496694!3d18.67861708244583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be803df3ec90e3b%3A0xf96fb840dcac5cce!2sThe%20Arboreal!5e0!3m2!1sen!2sin!4v1762453871538!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Arboreal Resort Location"
                className="rounded-2xl sm:rounded-3xl"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 px-4 sm:px-6 bg-[#2a2a2a]/95 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light mb-3 sm:mb-4 px-2 leading-tight">
              Ready to Experience Paradise?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto px-4">
              Book your stay at The Arboreal Resort and immerse yourself in
              luxury amidst nature's tranquility.
            </p>
            <a
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 sm:px-9 md:px-10 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm tracking-[0.18em] text-gray-900 font-medium uppercase hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Check Availability</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ContactUs;
