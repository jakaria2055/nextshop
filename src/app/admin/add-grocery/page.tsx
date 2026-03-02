"use client";
import {
  ArrowLeft,
  ArrowRight,
  Loader,
  PlusCircle,
  Upload,
} from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, floor & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

function AddGrocery() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [preview, setPreview] = useState<string | null>();
  const [backendImage, setBackendImage] = useState<File | null>();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length == 0) return;
    const file = files[0];
    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validation
    if (!name || !category || !unit || !price || !backendImage) {
      alert("Please fill all fields and upload an image");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post("/api/admin/add-grocery", formData);
      // Reset form on success
      setName("");
      setCategory("");
      setUnit("");
      setPrice("");
      setPreview(null);
      setBackendImage(null);

      alert("Grocery item added successfully!");

      console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-16 px-4 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          href={"/"}
          className="flex items-center gap-2 text-blue-700 font-semibold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-100 hover:shadow-lg transition-all border border-blue-200/50"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "loop" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          <span className="hidden md:flex">Back to Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
        className="bg-white/90 backdrop-blur-sm w-full max-w-2xl shadow-2xl rounded-3xl border border-blue-100/50 p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            whileHover={{ rotate: 360 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <PlusCircle className="text-blue-600 w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Add New Grocery Item
            </h1>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
            className="text-gray-500 text-sm mt-2 text-center"
          >
            Fill out the details below to add new fresh item
          </motion.p>
        </div>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          {/* NAME */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
          >
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Item Name<span className="text-red-500">*</span>
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                id="name"
                placeholder="Bread, milk, biscuit..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </motion.div>
          </motion.div>

          {/* UNIT & CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.3 }}
            >
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium mb-1"
              >
                Category<span className="text-red-500">*</span>
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <select
                  name="category"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white cursor-pointer"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option value={cat} key={i}>
                      {cat}
                    </option>
                  ))}
                </select>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.4 }}
            >
              <label
                htmlFor="unit"
                className="block text-gray-700 font-medium mb-1"
              >
                Unit<span className="text-red-500">*</span>
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <select
                  name="unit"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300 bg-white cursor-pointer"
                  onChange={(e) => setUnit(e.target.value)}
                  value={unit}
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option value={unit} key={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </motion.div>
            </motion.div>
          </div>

          {/* PRICE */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.5 }}
          >
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Item Price<span className="text-red-500">*</span>
            </label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <input
                type="text"
                id="price"
                placeholder="320"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </motion.div>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <motion.label
              htmlFor="image"
              whileHover={{ scale: 1.05, backgroundColor: "#e6f0ff" }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-semibold border-2 border-blue-200 rounded-xl px-6 py-3 hover:bg-blue-100 transition-all w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <Upload className="w-5 h-5" />
              </motion.div>
              Upload Image
            </motion.label>
            <input
              type="file"
              accept="image/*"
              id="image"
              hidden
              onChange={handleImageChange}
            />
            {preview && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative"
              >
                <Image
                  src={preview}
                  width={100}
                  height={100}
                  alt="image"
                  className="rounded-xl shadow-md border-2 border-blue-200 object-cover"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                />
              </motion.div>
            )}
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.7 }}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="w-5 h-5" />
                  </motion.div>
                  Adding Item...
                </>
              ) : (
                <>
                  Add Item
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </>
              )}
            </span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddGrocery;