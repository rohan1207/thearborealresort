import React, { useState } from "react";
import { motion } from "framer-motion";

const rooms = [
  { id: 1, name: "Single room", active: true },
  { id: 2, name: "Double room", active: false },
  { id: 3, name: "Royal suite", active: false },
  { id: 4, name: "Deluxe suite", active: false },
];

const RoomsMenu = () => {
  const [activeRoom, setActiveRoom] = useState(1);

  return (
    <section className="py-20 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-wrap justify-center items-center gap-16 lg:gap-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              className="relative group cursor-pointer"
              onClick={() => setActiveRoom(room.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <motion.h3
                className={`text-2xl lg:text-3xl font-light transition-all duration-500 cursor-pointer ${
                  activeRoom === room.id
                    ? "text-stone-900 font-normal"
                    : "text-stone-400 hover:text-stone-600"
                }`}
                style={{ fontFamily: 'serif' }}
                whileHover={{ 
                  scale: activeRoom === room.id ? 1 : 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                {room.name}
              </motion.h3>
              
              {/* Active underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-amber-600"
                initial={{ width: 0 }}
                animate={{ 
                  width: activeRoom === room.id ? "100%" : "0%"
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
              
              {/* Hover underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-stone-300"
                initial={{ width: 0 }}
                whileHover={{ 
                  width: activeRoom === room.id ? "0%" : "80%"
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Optional decorative element */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default RoomsMenu;