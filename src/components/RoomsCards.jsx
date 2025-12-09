import React, { useState, useEffect } from "react";

const roomsData = [
  {
    id: 1,
    title: "Single Room",
    subtitle: "Phenomenal comfort",
    description:
      "Do relax and get the homely feeling in our single room. It is very spacious and fitted with a semi double bed. Apart from this, you will get breakfast included, Lawn View, full AC, free wifi, free newspaper.",
    price: 2500,
    currency: "₹",
    period: "Per night",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    ],
    features: ["Breakfast Included", "Free Wi-Fi", "Full AC", "Lawn View"],
  },
  {
    id: 2,
    title: "Double Room",
    subtitle: "Spacious elegance",
    description:
      "Do relax and get the homely feeling in our Double room. It is very spacious and fitted with a semi double bed. Apart from this, you will get breakfast included, Lawn View, full AC, free wifi, free newspaper.",
    price: 4000,
    currency: "₹",
    period: "Per night",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    ],
    features: ["Breakfast Included", "Free Wi-Fi", "Full AC", "Lawn View"],
  },
  {
    id: 3,
    title: "Royal Suit",
    subtitle: "Ultimate luxury",
    description:
      "Royal Stay experience with the quality premium service and comfort, specially design for the premium guest considering all the required facilities and comfortable features with king size king koil bed.",
    price: 8000,
    currency: "₹",
    period: "Per night",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    ],
    features: ["King Size Bed", "Premium Service", "Luxury Amenities"],
  },
  {
    id: 4,
    title: "Delux Suit",
    subtitle: "Premium comfort",
    description:
      "You will admire the beauty and beautiful view by the deluxe suites. You will not wish to leave the room because you will be enjoying many of the benefits like breakfast included, full ac, smart facilities, premium comfort.",
    price: 6500,
    currency: "₹",
    period: "Per night",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80https://images.unsplash.com/photo-1578898886225-ee0cb6e9c18d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    ],
    features: ["Premium Comfort", "Smart Facilities", "Beautiful View"],
  },
];

const ImageSlider = ({ images, title, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  return (
    <div className="relative overflow-hidden group h-full">
      <img
        src={images[currentImageIndex]}
        alt={`${title} - Image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <span className="text-lg lg:text-xl font-light">‹</span>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <span className="text-lg lg:text-xl font-light">›</span>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentImageIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const RoomsCards = () => {
  return (
    <section className="py-8 lg:py-16 bg-gradient-to-br from-stone-50 to-neutral-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="space-y-8 lg:space-y-24">
          {roomsData.map((room, index) => (
            <div
              key={room.id}
              className={`grid lg:grid-cols-2 gap-0 items-stretch bg-white rounded-md lg:rounded-md overflow-hidden shadow-xl lg:shadow-2xl ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              {/* Image Section */}
              <div
                className={`relative ${
                  index % 2 === 1 ? "lg:col-start-2" : ""
                } h-64 md:h-80 lg:h-auto lg:min-h-[500px]`}
              >
                <ImageSlider
                  images={room.images}
                  title={room.title}
                  index={index}
                />
              </div>

              {/* Content Section */}
              <div
                className={`p-6 md:p-8 lg:p-16 flex flex-col justify-center space-y-6 lg:space-y-8 bg-gradient-to-br from-stone-50 to-white ${
                  index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                }`}
              >
                <div className="space-y-4 lg:space-y-6">
                  <p className="text-amber-600 text-xs md:text-sm font-medium tracking-[0.2em] uppercase">
                    {room.subtitle}
                  </p>

                  <h2
                    className="text-2xl md:text-3xl lg:text-5xl font-light text-stone-900 leading-tight"
                    style={{ fontFamily: "serif" }}
                  >
                    {room.title}
                  </h2>

                  <p className="text-stone-600 leading-relaxed text-sm md:text-base lg:text-lg font-light">
                    {room.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {room.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 lg:px-4 lg:py-2 bg-white border border-stone-200 text-stone-700 rounded-full text-xs md:text-sm font-medium hover:bg-stone-50 transition-colors duration-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 lg:pt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-light text-stone-900">
                      {room.currency}
                      {room.price.toLocaleString()}
                    </span>
                    <span className="text-stone-500 text-xs md:text-sm font-light">
                      {room.period}
                    </span>
                  </div>

                  <button className="px-6 py-2.5 lg:px-8 lg:py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    Book your stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsCards;
