"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

function Footer() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-linear-to-r from-blue-600 to-blue-700 text-white mt-20"
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-blue-500/40">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-3">NextShop</h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Your one-stop online grocery shop delivering freshness to your
            doorstep. Shop smart, eat fresh, and save more every day.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-blue-100">
            <li>
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/user/cart" className="hover:text-white transition-colors duration-200">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/user/my-orders" className="hover:text-white transition-colors duration-200">
                My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-3 text-blue-100">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>123 Grocery Street, Foodville, FC 12345</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span>support@nextshop.com</span>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors duration-200"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors duration-200"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm text-blue-100 mt-4">
            Stay connected for updates and offers!
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="w-[90%] md:w-[80%] mx-auto py-4 text-center text-sm text-blue-200">
        <p>&copy; {new Date().getFullYear()} NextShop. All rights reserved.</p>
      </div>
    </motion.div>
  );
}

export default Footer;