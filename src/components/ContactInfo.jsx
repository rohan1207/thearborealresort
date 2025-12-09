import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactInfo() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start p-4 sm:p-6 gap-6 sm:gap-8 w-full max-w-4xl mx-auto z-10 ">
      {/* Address */}
      <div className="flex items-start gap-3 w-full sm:w-1/3">
        <div className="w-10 h-10 sm:w-9 sm:h-9 bg-[#2a2a2a]/95 rounded-md flex justify-center items-center shrink-0">
          <FaMapMarkerAlt className="text-white text-lg sm:text-base" />
        </div>
        <div className="text-left">
          <div className="flex items-center">
            <h3 className="font-semibold text-base sm:text-lg">Address</h3>
          </div>
          <a
            href="https://maps.app.goo.gl/yRiS3JvhrWyccoNJ7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 text-sm leading-tight mt-1 hover:text-[#2a2a2a] transition-colors duration-200 block"
          >
            Block A - 904 Riviera Heights near Riviera township, Mata Mandir,
            Bhopal, Madhya Pradesh 462016
          </a>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3 w-full sm:w-1/3">
        <div className="w-10 h-10 sm:w-9 sm:h-9 bg-[#2a2a2a]/95 rounded-md flex justify-center items-center shrink-0">
          <FaPhoneAlt className="text-white text-lg sm:text-base" />
        </div>
        <div className="text-left">
          <div className="flex items-center">
            <h3 className="font-semibold text-base sm:text-lg">Call</h3>
          </div>
          <p className="text-gray-600 text-sm leading-tight mt-1">
            <a
              href="tel:+918380035320"
              className="hover:text-[#2a2a2a] transition-colors duration-200"
            >
              +919545583535
              <br />
              +918380035320
            </a>
            <br />
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-3 w-full sm:w-1/3">
        <div className="w-10 h-10 sm:w-9 sm:h-9 bg-[#2a2a2a]/95 rounded-md flex justify-center items-center shrink-0">
          <FaEnvelope className="text-white text-lg sm:text-base" />
        </div>
        <div className="text-left">
          <div className="flex items-center">
            <h3 className="font-semibold text-base sm:text-lg">Email</h3>
          </div>
          <p className="text-gray-600 text-sm leading-tight mt-1">
            <a
              href="mailto:aagaur.studio@gmail.com"
              className="hover:text-[#2a2a2a] transition-colors duration-200"
            >
              aagaur.studio@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
