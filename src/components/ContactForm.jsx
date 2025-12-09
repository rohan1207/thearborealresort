import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
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
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
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

Message:
${formData.message}
    `.trim();

    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // On mobile, directly use mailto: protocol to open native email app
      const mailtoLink = `mailto:aagaur.studio@gmail.com?subject=${encodeURIComponent(
        `New Contact Form Submission from ${formData.name}`
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
      gmailComposeUrl.searchParams.set("to", "aagaur.studio@gmail.com");
      gmailComposeUrl.searchParams.set(
        "su",
        `New Contact Form Submission from ${formData.name}`
      );
      gmailComposeUrl.searchParams.set("body", emailBody);
      gmailComposeUrl.searchParams.set("cc", formData.email);

      // Open Gmail compose window
      const gmailWindow = window.open(gmailComposeUrl.toString(), "_blank");

      if (gmailWindow) {
        setStatus("Opening email in web browser...");
      } else {
        // If popup was blocked, try mailto as fallback
        const mailtoLink = `mailto:aagaur.studio@gmail.com?subject=${encodeURIComponent(
          `New Contact Form Submission from ${formData.name}`
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

    const formattedMessage =
      "*New Contact Form Submission*" +
      "\n\n" +
      "*Name:* " +
      formData.name +
      "\n" +
      "*Email:* " +
      formData.email +
      "\n" +
      "*Phone:* " +
      formData.phone +
      "\n\n" +
      "*Message:*\n" +
      formData.message;

    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919340965799&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setStatus("Redirecting to WhatsApp...");
  };

  return (
    <div className="mt-[180px] lg:mt-[86px] px-4 sm:px-8 z-0">
      <h2 className="text-lg font-semibold mb-4">Send Us a Message</h2>

      {/* Toggle Between Email & WhatsApp */}
      <div className="flex gap-4 mb-4">
        <button
          className={`w-[158px] h-[42px] border-2 rounded-md flex justify-center items-center text-sm md:text-base ${
            !isWhatsApp ? "bg-black text-white" : "bg-gray-300 text-black"
          }`}
          onClick={() => setIsWhatsApp(false)}
        >
          Send Email
        </button>

        <button
          className={`w-[158px] h-[42px] border-2 rounded-md flex justify-center items-center text-sm md:text-base ${
            isWhatsApp ? "bg-black text-white" : "bg-gray-300 text-black"
          }`}
          onClick={() => setIsWhatsApp(true)}
        >
          WhatsApp
        </button>
      </div>
      {isWhatsApp && (
        <div className="w-full bg-grey-700 border border-grey-700 rounded-md p-4 sm:p-5 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-black">
            WhatsApp Direct Connect
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Start a conversation with us instantly on WhatsApp. Our team is
            ready to assist you.
          </p>
        </div>
      )}
      <form
        onSubmit={isWhatsApp ? (e) => e.preventDefault() : handleSubmit}
        className="space-y-4 max-w-full"
      >
        <div>
          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md text-sm md:text-base`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md text-sm md:text-base`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>{" "}
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Contact Number *"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md text-sm md:text-base`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Your Message... *"
            value={formData.message}
            onChange={handleChange}
            className={`w-full p-3 border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } rounded-md h-24 text-sm md:text-base`}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>
        {/* Conditional Rendering for Buttons */}
        {isWhatsApp ? (
          <button
            type="button"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black transition"
            onClick={sendToWhatsapp}
          >
            Send via WhatsApp
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black transition"
          >
            Send Email
          </button>
        )}
      </form>

      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
