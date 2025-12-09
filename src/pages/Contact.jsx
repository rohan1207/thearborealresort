import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isWhatsApp, setIsWhatsApp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}

Message:
${formData.message}
    `.trim();

    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile, directly use mailto: protocol to open native email app
      const mailtoLink = `mailto:marketing@futureal.in?subject=${encodeURIComponent(
        `${formData.subject} - ${formData.name}`
      )}&body=${encodeURIComponent(emailBody)}&cc=${encodeURIComponent(
        formData.email
      )}`;
      window.location.href = mailtoLink;
      setStatus("Opening email app...");
    } else {
      // On desktop, try Gmail compose in browser first
      const gmailComposeUrl = new URL("https://mail.google.com/mail/");
      gmailComposeUrl.searchParams.set("view", "cm");
      gmailComposeUrl.searchParams.set("fs", "1");
      gmailComposeUrl.searchParams.set("to", "marketing@futureal.in");
      gmailComposeUrl.searchParams.set(
        "su",
        `${formData.subject} - ${formData.name}`
      );
      gmailComposeUrl.searchParams.set("body", emailBody);
      gmailComposeUrl.searchParams.set("cc", formData.email);

      // Open Gmail compose window
      const gmailWindow = window.open(gmailComposeUrl.toString(), "_blank");

      if (gmailWindow) {
        setStatus("Opening email in web browser...");
      } else {
        // If popup was blocked, try mailto as fallback
        const mailtoLink = `mailto:marketing@futureal.in?subject=${encodeURIComponent(
          `${formData.subject} - ${formData.name}`
        )}&body=${encodeURIComponent(emailBody)}&cc=${encodeURIComponent(
          formData.email
        )}`;
        window.location.href = mailtoLink;
        setStatus("Opening email client...");
      }
    }
  };

  const sendToWhatsapp = () => {
    if (!validateForm()) {
      return;
    }

    // Format the message for WhatsApp
    const formattedMessage = `*New Contact Form Submission*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Subject:* ${formData.subject}\n\n*Message:*\n${formData.message}`;

    const encodedMessage = encodeURIComponent(formattedMessage);
    const phoneNumber = "7489849784"; // Updated phone number

    // Detect if the user is on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile, try WhatsApp app first, then fallback to web
      const whatsappAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
      const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

      // Try to open WhatsApp app
      const appLink = document.createElement("a");
      appLink.href = whatsappAppUrl;
      appLink.click();

      // Fallback to web WhatsApp after a short delay if app doesn't open
      setTimeout(() => {
        window.open(whatsappWebUrl, "_blank");
      }, 1000);

      setStatus("Opening WhatsApp...");
    } else {
      // On desktop, check if WhatsApp Desktop is available, otherwise use web
      const whatsappDesktopUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
      const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

      // Try WhatsApp Desktop first
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = whatsappDesktopUrl;
      document.body.appendChild(iframe);

      // Clean up iframe after attempt
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);

      // Fallback to web WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappWebUrl, "_blank");
      }, 1500);

      setStatus("Opening WhatsApp...");
    }
  };

  const contactInfo = [
    {
      title: "Address",
      details: ["Riviera Heights", "Bhopal, Madhya Pradesh", "India"],
      icon: "📍",
    },
    {
      title: "Contact",
      details: ["contact@studioaagaur.com", "+91 XXX XXX XXXX"],
      icon: "📞",
    },
    {
      title: "Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
        "Sunday: Closed",
      ],
      icon: "🕒",
    },
    {
      title: "WhatsApp",
      details: ["Quick Response", "Business Inquiries", "Click to Chat"],
      icon: "💬",
      isWhatsApp: true,
      whatsappNumber: "7489849784", // Replace with actual number
      whatsappMessage:
        "Hello! I'm interested in Studio Aagaur's architectural services.",
    },
  ];

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Subtle texture overlay - matching About Us */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(240,240,240,0.1),transparent)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(240,240,240,0.1),transparent)] animate-pulse delay-1000"></div>
      </div>
      {/* Hero Section */}
      <div className="relative flex flex-col xl:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 min-h-screen gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
        {/* Minimal floating dots */}
        <div className="absolute top-4 sm:top-8 lg:top-12 xl:top-16 right-4 sm:right-8 lg:right-12 xl:right-16 w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 sm:bottom-8 lg:bottom-12 xl:bottom-16 left-4 sm:left-8 lg:left-12 xl:left-16 w-1 h-1 bg-gray-600 rounded-full animate-pulse delay-1000"></div>

        {/* TEXT BLOCK LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full xl:w-1/2 z-10 group order-1 xl:order-1"
        >
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <span className="inline-block px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium bg-gray-900/50 border border-gray-700 rounded-md text-white mb-2 sm:mb-3 lg:mb-4 tracking-wide">
              GET IN TOUCH
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-thin mb-3 sm:mb-4 lg:mb-6 tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.3em] text-black leading-tight">
              CONTACT
            </h1>
            <div className="h-px w-16 sm:w-20 lg:w-32 bg-gray-600 mb-3 sm:mb-4 lg:mb-6"></div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500 mb-4 sm:mb-6 lg:mb-8 tracking-wide">
              Let's Create Something Together
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4 lg:space-y-5 text-xs sm:text-sm lg:text-base text-black leading-relaxed">
            <p className="group-hover:text-gray-700 transition-colors duration-500">
              We're here to bring your architectural vision to life. Whether
              you're planning a residential project, commercial space, or
              seeking consultation on heritage preservation, Studio Aagaur is
              ready to collaborate.
            </p>
            <p className="group-hover:text-gray-700 transition-colors duration-500">
              Reach out to discuss your project, ask questions, or explore how
              we can help create meaningful spaces that honor tradition while
              embracing innovation.
            </p>
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-12 flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-600"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 sm:w-3 lg:w-4 h-px bg-gray-700"></div>
          </div>
        </motion.div>

        {/* FORM BLOCK RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="relative group w-full xl:w-1/2 order-2 xl:order-2"
        >
          <div className="absolute inset-0 bg-gray-900/20 rounded-none blur-2xl transform group-hover:scale-105 transition-transform duration-700"></div>
          <div className="relative border-2 border-gray-300 p-3 sm:p-4 md:p-6 lg:p-8 bg-white shadow-2xl">
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-thin tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] text-center text-black mb-2 sm:mb-3 lg:mb-4">
                SEND MESSAGE
              </h2>
              <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-600 mx-auto mb-3 sm:mb-4 lg:mb-6"></div>

              {/* Toggle Between Email & WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6 justify-center">
                <button
                  type="button"
                  className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-2 text-xs sm:text-sm tracking-wide font-light transition-all duration-300 ${
                    !isWhatsApp
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-600"
                  }`}
                  onClick={() => setIsWhatsApp(false)}
                >
                  EMAIL
                </button>

                <button
                  type="button"
                  className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-2 text-xs sm:text-sm tracking-wide font-light transition-all duration-300 ${
                    isWhatsApp
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-600"
                  }`}
                  onClick={() => setIsWhatsApp(true)}
                >
                  WHATSAPP
                </button>
              </div>

              {/* WhatsApp Info Banner */}
              {isWhatsApp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-50 border-2 border-green-200 p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4 lg:mb-6"
                >
                  <h3 className="text-xs sm:text-sm lg:text-base font-thin tracking-wide text-green-800 mb-1 sm:mb-2">
                    WHATSAPP DIRECT CONNECT
                  </h3>
                  <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                    Start a conversation with us instantly on WhatsApp. Our team
                    is ready to assist you.
                  </p>
                </motion.div>
              )}
            </div>

            {status && (
              <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                <p className="text-xs sm:text-sm text-gray-600 tracking-wide">
                  {status}
                </p>
              </div>
            )}

            <form
              onSubmit={isWhatsApp ? (e) => e.preventDefault() : handleSubmit}
              className="space-y-3 sm:space-y-4 lg:space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="YOUR NAME *"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2.5 sm:p-3 lg:p-4 border-2 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } 
                      focus:border-gray-600 focus:outline-none transition-colors duration-300 
                      text-xs sm:text-sm tracking-wide placeholder-gray-400 bg-white`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 sm:mt-2 tracking-wide">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="YOUR EMAIL *"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2.5 sm:p-3 lg:p-4 border-2 ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } 
                      focus:border-gray-600 focus:outline-none transition-colors duration-300 
                      text-xs sm:text-sm tracking-wide placeholder-gray-400 bg-white`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 sm:mt-2 tracking-wide">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="PHONE NUMBER *"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-2.5 sm:p-3 lg:p-4 border-2 ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  } 
                    focus:border-gray-600 focus:outline-none transition-colors duration-300 
                    text-xs sm:text-sm tracking-wide placeholder-gray-400 bg-white`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1 sm:mt-2 tracking-wide">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="SUBJECT *"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full p-2.5 sm:p-3 lg:p-4 border-2 ${
                    errors.subject ? "border-red-300" : "border-gray-300"
                  } 
                    focus:border-gray-600 focus:outline-none transition-colors duration-300 
                    text-xs sm:text-sm tracking-wide placeholder-gray-400 bg-white`}
                />
                {errors.subject && (
                  <p className="text-red-400 text-xs mt-1 sm:mt-2 tracking-wide">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="YOUR MESSAGE *"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full p-2.5 sm:p-3 lg:p-4 border-2 ${
                    errors.message ? "border-red-300" : "border-gray-300"
                  } 
                    focus:border-gray-600 focus:outline-none transition-colors duration-300 
                    text-xs sm:text-sm tracking-wide placeholder-gray-400 bg-white resize-none`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1 sm:mt-2 tracking-wide">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type={isWhatsApp ? "button" : "submit"}
                onClick={isWhatsApp ? sendToWhatsapp : undefined}
                className={`w-full py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] 
                  transition-colors duration-300 border-2 font-light ${
                    isWhatsApp
                      ? "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700"
                      : "bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800"
                  }`}
              >
                {isWhatsApp ? "SEND VIA WHATSAPP" : "SEND MESSAGE"}
              </button>
            </form>

            {/* Floating frame effect */}
            <div className="absolute -top-1 sm:-top-2 lg:-top-4 -right-1 sm:-right-2 lg:-right-4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border-t-2 border-r-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-4 -left-1 sm:-left-2 lg:-left-4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border-b-2 border-l-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </motion.div>
      </div>
      {/* Contact Information Section */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.3em] mb-3 sm:mb-4 lg:mb-6 text-black">
            VISIT US
          </h2>
          <div className="w-16 sm:w-20 lg:w-32 h-px bg-gray-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          {contactInfo.map((info, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref);

            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className="group relative"
              >
                <div
                  className={`relative bg-white border-2 border-gray-800 p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:border-gray-600 ${
                    info.isWhatsApp ? "cursor-pointer hover:bg-green-50" : ""
                  }`}
                  onClick={
                    info.isWhatsApp
                      ? () => {
                          const message = encodeURIComponent(
                            info.whatsappMessage
                          );
                          const phoneNumber = info.whatsappNumber;
                          const isMobile = /iPhone|iPad|iPod|Android/i.test(
                            navigator.userAgent
                          );

                          if (isMobile) {
                            // On mobile, try WhatsApp app first
                            const whatsappAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
                            const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

                            const appLink = document.createElement("a");
                            appLink.href = whatsappAppUrl;
                            appLink.click();

                            // Fallback to web WhatsApp
                            setTimeout(() => {
                              window.open(whatsappWebUrl, "_blank");
                            }, 1000);
                          } else {
                            // On desktop, try WhatsApp Desktop first
                            const whatsappDesktopUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
                            const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

                            const iframe = document.createElement("iframe");
                            iframe.style.display = "none";
                            iframe.src = whatsappDesktopUrl;
                            document.body.appendChild(iframe);

                            setTimeout(() => {
                              document.body.removeChild(iframe);
                            }, 1000);

                            setTimeout(() => {
                              window.open(whatsappWebUrl, "_blank");
                            }, 1500);
                          }
                        }
                      : undefined
                  }
                >
                  {/* Icon */}
                  <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4">
                      {info.icon}
                    </div>
                    <span className="inline-block px-1.5 sm:px-2 lg:px-3 py-1 text-xs font-medium bg-gray-900/50 border border-gray-700 rounded-md text-gray-400 tracking-wide">
                      {info.isWhatsApp ? "WHATSAPP" : "CONTACT"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg lg:text-xl font-thin mb-2 sm:mb-3 lg:mb-4 tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] text-center text-black">
                    {info.title.toUpperCase()}
                  </h3>

                  {/* Separator line */}
                  <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-700 mx-auto mb-3 sm:mb-4 lg:mb-6"></div>

                  {/* Details */}
                  <div className="text-center space-y-1 sm:space-y-2">
                    {info.details.map((detail, i) => (
                      <p
                        key={i}
                        className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-black transition-colors duration-500"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>

                  {/* Decorative element */}
                  <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-center">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-3 sm:w-4 lg:w-6 h-px bg-gray-700"></div>
                      <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-3 sm:w-4 lg:w-6 h-px bg-gray-700"></div>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0.5 sm:top-1 lg:top-2 right-0.5 sm:right-1 lg:right-2 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 border-t border-r border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0.5 sm:bottom-1 lg:bottom-2 left-0.5 sm:left-1 lg:left-2 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 border-b border-l border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
          className="relative group max-w-6xl mx-auto"
        >
          <div className="absolute inset-0 bg-gray-900/20 rounded-none blur-2xl transform group-hover:scale-105 transition-transform duration-700"></div>
          <div className="relative border-2 border-gray-300 bg-white shadow-2xl overflow-hidden">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              {isMapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                  <div className="flex flex-col items-center">
                    <div className="w-8 sm:w-12 h-8 sm:h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-light text-sm tracking-wide">
                      Loading map...
                    </p>
                  </div>
                </div>
              )}

              <div
                className="w-full h-full cursor-pointer relative"
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/qFzRf8qURRK4mkzGA",
                    "_blank"
                  )
                }
              >
                <div className="absolute inset-0 bg-white bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 z-10"></div>
                <iframe
                  className="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.535229779206!2d77.39816427601204!3d23.22360260879497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c438e133823e1%3A0x206343706ad2562f!2sRiviera%20Heights!5e0!3m2!1sen!2sin!4v1752646029988!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setIsMapLoading(false)}
                ></iframe>
              </div>
            </div>

            {/* Floating frame effect */}
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </motion.div>
      </div>
         
    </div>
  );
}
