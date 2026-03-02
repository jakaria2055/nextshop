"use client";
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  Coffee,
  User,
  Home,
  Package,
  Baby,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CategorySlider() {
  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "from-green-400 to-green-500", bgLight: "bg-green-50" },
    { id: 2, name: "Dairy & Eggs", icon: Milk, color: "from-yellow-400 to-yellow-500", bgLight: "bg-yellow-50" },
    { id: 3, name: "Rice, Flour & Grains", icon: Wheat, color: "from-orange-400 to-orange-500", bgLight: "bg-orange-50" },
    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "from-pink-400 to-pink-500", bgLight: "bg-pink-50" },
    { id: 5, name: "Spices & Masalas", icon: Flame, color: "from-red-400 to-red-500", bgLight: "bg-red-50" },
    { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "from-blue-400 to-blue-500", bgLight: "bg-blue-50" },
    { id: 7, name: "Personal Care", icon: User, color: "from-purple-400 to-purple-500", bgLight: "bg-purple-50" },
    { id: 8, name: "Household Essentials", icon: Home, color: "from-gray-400 to-gray-500", bgLight: "bg-gray-50" },
    { id: 9, name: "Instant & Packaged Food", icon: Package, color: "from-teal-400 to-teal-500", bgLight: "bg-teal-50" },
    { id: 10, name: "Baby & Pet Care", icon: Baby, color: "from-indigo-400 to-indigo-500", bgLight: "bg-indigo-50" },
  ];

  const [showLeft, setShowLeft] = useState<boolean>(false); // Fixed: Boolean -> boolean
  const [showRight, setShowRight] = useState<boolean>(true); // Fixed: Boolean -> boolean
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false); // Added to pause auto-scroll
  const [scrollProgress, setScrollProgress] = useState(0); // Added for progress indicator

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    
    // Update progress indicator
    const progress = Math.floor(scrollLeft / 300);
    setScrollProgress(progress);
  };

  // Auto-scroll effect - only when not hovering
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (!scrollRef.current || isHovering) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, [isHovering]); // Added isHovering as dependency

  useEffect(() => {
    const current = scrollRef.current;
    if (current) {
      current.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => {
      if (current) {
        current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[90%] md:w-[80%] mx-auto mt-16 relative"
      onMouseEnter={() => setIsHovering(true)} // Pause auto-scroll
      onMouseLeave={() => setIsHovering(false)} // Resume auto-scroll
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-8 w-1 bg-blue-600 rounded-full" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shop by Category
        </h2>
        <div className="h-8 w-1 bg-blue-600 rounded-full" />
      </div>

      {/* Navigation Buttons */}
      <AnimatePresence>
        {showLeft && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center transition-all z-10 border border-gray-200"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRight && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center transition-all z-10 border border-gray-200"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Categories Container */}
      <div
        className="flex gap-5 overflow-x-auto px-12 pb-6 scrollbar-hide scroll-smooth"
        ref={scrollRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              onHoverStart={() => setHoveredId(cat.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={`min-w-[160px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${cat.bgLight} border border-gray-200 shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group`}
            >
              {/* Gradient overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === cat.id ? 0.1 : 0 }}
                className={`absolute inset-0 bg-gradient-to-br ${cat.color}`}
              />
              
              {/* Content */}
              <div className="flex flex-col items-center justify-center p-6 relative z-10">
                <motion.div
                  animate={{ 
                    rotate: hoveredId === cat.id ? [0, -10, 10, -5, 0] : 0,
                    scale: hoveredId === cat.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="mb-3"
                >
                  <Icon className={`w-10 h-10 ${
                    cat.id === 1 ? "text-green-600" :
                    cat.id === 2 ? "text-yellow-600" :
                    cat.id === 3 ? "text-orange-600" :
                    cat.id === 4 ? "text-pink-600" :
                    cat.id === 5 ? "text-red-600" :
                    cat.id === 6 ? "text-blue-600" :
                    cat.id === 7 ? "text-purple-600" :
                    cat.id === 8 ? "text-gray-600" :
                    cat.id === 9 ? "text-teal-600" :
                    "text-indigo-600"
                  }`} />
                </motion.div>
                
                <p className="text-center text-sm md:text-base font-semibold text-gray-700">
                  {cat.name}
                </p>
                
                {/* Shop now indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredId === cat.id ? 1 : 0, y: hoveredId === cat.id ? 0 : 10 }}
                  className="mt-2 text-xs font-medium text-blue-600"
                >
                  Shop now →
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll Progress Indicator */}
      <div className="flex justify-center gap-1 mt-4">
        {categories.slice(0, Math.ceil(categories.length / 2)).map((_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full"
            animate={{
              width: i === scrollProgress % categories.length ? 16 : 4,
              backgroundColor: i === scrollProgress % categories.length ? "#2563eb" : "#d1d5db"
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default CategorySlider;