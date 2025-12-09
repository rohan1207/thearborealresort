import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rooms = [
  {
    id: "01",
    name: "Single Room",
    title: "Phenomenal comfort",
    description:
      "Do relax and get the homely feeling in our single room. It is very spacious and fitted with a semi double bed. Apart from this, you will get breakfast included, Lawn View, full AC, free wifi, free newspaper.",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "02",
    name: "Double Room",
    title: "Spacious elegance",
    description:
      "Do relax and get the homely feeling in our Double room. It is very spacious and fitted with a semi double bed. Apart from this, you will get breakfast included, Lawn View, full AC, free wifi, free newspaper.",
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80https://images.unsplash.com/photo-1578898886225-ee0cb6e9c18d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "03",
    name: "Royal Suit",
    title: "Ultimate luxury",
    description:
      "Royal Stay experience with the quality premium service and comfort, speically design for the premium guest considering all the required facilites and comfortable features with king size king koil bed.",
    price: 8000,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "04",
    name: "Delux Suit",
    title: "Premium comfort",
    description:
      "You will admire the beauty and beautiful view by the deluxe suites. You will not wish to leave the room because you will be enjoying many of the benefits like breakfast included, full ac, smart facilities, premium comfort.",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "05",
    name: "Grand deluxe room",
    title: "Exceptional stay",
    description:
      "Experience the ultimate in luxury and comfort with our grand deluxe room featuring premium amenities and exceptional service for an unforgettable stay.",
    price: 7000,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
];

const amenityLabels = [
  "Single Room",
  "Double Room",
  "Royal Suite",
  "Deluxe Suite",
  "Grand Deluxe Room",
];

const RoomInfo = () => {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  return (
    <div>
      {/* Header Section */}
      <div className="text-center py-8 sm:py-12">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#6D2C2C] tracking-tight mb-2 sm:mb-3 drop-shadow-sm px-4">
          Our Royal Rooms At Swaranjali
        </h2>
        <h3 className="text-sm sm:text-lg md:text-xl font-light text-stone-700 max-w-2xl mx-auto leading-relaxed px-4">
          Every room at{" "}
          <span className="font-semibold text-[#6D2C2C]">Swaranjali Hotel</span>{" "}
          tells a story of comfort and class.
        </h3>
      </div>

      {/* Desktop View - Original Layout */}
      <div className="hidden md:block min-h-[80vh] bg-gradient-to-br from-amber-50 to-stone-100">
        <div className="flex">
          {/* Left Panel - Room List */}
          <div className="w-96 bg-gradient-to-b from-stone-200 to-stone-100 p-8 flex flex-col justify-center">
            <div className="space-y-6">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  className={`flex items-center justify-between p-4 rounded-md cursor-pointer transition-all duration-300 ${
                    selectedRoom.id === room.id
                      ? "bg-gradient-to-r from-[#6D2C2C] to-[#6D2C2C] text-white shadow-lg"
                      : "hover:bg-white/50 text-stone-700"
                  }`}
                  onClick={() => setSelectedRoom(room)}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-medium ${
                        selectedRoom.id === room.id
                          ? "text-white/80"
                          : "text-stone-500"
                      }`}
                    >
                      {room.id}
                    </span>
                    <span className="font-medium text-lg">
                      {amenityLabels[index]}
                    </span>
                  </div>
                  <motion.span
                    className={`text-xl transform transition-all duration-300 ${
                      selectedRoom.id === room.id
                        ? "translate-x-0 opacity-100 text-white"
                        : "-translate-x-2 opacity-60 text-stone-600"
                    }`}
                  >
                    →
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative">
            {/* Room Image */}
            <motion.div className="absolute inset-0" key={selectedRoom.id}>
              <motion.img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            </motion.div>

            {/* Right Info Panel */}
            <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-white via-white/95 to-white/80 p-8 flex flex-col justify-center">
              <motion.div
                key={selectedRoom.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-amber-600 text-sm font-medium tracking-wider uppercase mb-2">
                    {selectedRoom.title}
                  </p>
                  <h1 className="text-4xl font-bold text-stone-900 mb-4 leading-tight">
                    {selectedRoom.name}
                  </h1>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {selectedRoom.description}
                  </p>
                </div>
              </motion.div>

              {/* Bottom Info Panel */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 p-8">
                <div className="flex justify-between items-end">
                  {/* Price and Book Button */}
                  <div className="flex items-center gap-8">
                    <div className="bg-stone-100 px-6 py-4 rounded-md">
                      <p className="text-stone-600 text-sm mb-1">
                        Starting from
                      </p>
                      <p className="text-3xl font-bold text-stone-900">
                        ₹{selectedRoom.price.toLocaleString()}
                      </p>
                    </div>

                    <motion.button
                      className="bg-stone-900 text-white px-8 py-4 rounded-md flex items-center gap-3 group shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="font-medium">BOOK NOW</span>
                      <motion.span className="transform transition-transform group-hover:translate-x-1">
                        →
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Compact Card Interface */}
      <div className="md:hidden bg-gradient-to-br from-amber-50 to-stone-100 pb-6">
        {/* Room Selection Tabs */}
        <div className="px-4 mb-4">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {rooms.map((room, index) => (
              <motion.button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedRoom.id === room.id
                    ? "bg-[#6D2C2C] text-white shadow-md"
                    : "bg-white/80 text-stone-700 hover:bg-white"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {amenityLabels[index]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Room Card */}
        <div className="px-4">
          <motion.div
            key={selectedRoom.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-md shadow-lg overflow-hidden"
          >
            {/* Room Image */}
            <div className="relative h-48 sm:h-56">
              <motion.img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Room ID Badge */}
              <div className="absolute top-4 left-4 bg-[#6D2C2C] text-white px-3 py-1 rounded-full text-xs font-medium">
                Room {selectedRoom.id}
              </div>
            </div>

            {/* Room Details */}
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <p className="text-amber-600 text-xs font-medium tracking-wider uppercase mb-1">
                  {selectedRoom.title}
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 leading-tight">
                  {selectedRoom.name}
                </h1>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {selectedRoom.description}
                </p>
              </div>

              {/* Price and Book Button */}
              <div className="flex items-center justify-between">
                <div className="bg-stone-50 px-4 py-3 rounded-md">
                  <p className="text-stone-600 text-xs mb-1">Starting from</p>
                  <p className="text-xl sm:text-2xl font-bold text-stone-900">
                    ₹{selectedRoom.price.toLocaleString()}
                  </p>
                </div>

                <motion.button
                  className="bg-[#6D2C2C] text-white px-6 py-3 rounded-md flex items-center gap-2 group shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium text-sm">BOOK NOW</span>
                  <motion.span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </motion.span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Room Navigation Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedRoom.id === room.id
                  ? "bg-[#6D2C2C] w-6"
                  : "bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
