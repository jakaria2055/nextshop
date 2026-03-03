"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Loader,
  Package,
  Pencil,
  Search,
  Upload,
  X,
  Trash2,
  Edit3,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IGrocery } from "@/models/groceryModel";
import Image from "next/image";

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

function ViewGrocery() {
  const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filtered, setFiltered] = useState<IGrocery[]>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries");
        setGroceries(result.data);
        setFiltered(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    if (!editing) return;
    try {
      const formData = new FormData();

      formData.append("groceryId", editing?._id?.toString());
      formData.append("name", editing?.name);
      formData.append("category", editing.category);
      formData.append("price", editing.price);
      formData.append("unit", editing.unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post("/api/admin/edit-grocery", formData);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    if (!editing) return;
    try {
      const result = await axios.post("/api/admin/delete-grocery", {
        groceryId: editing._id,
      });
      setDeleteLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const q = search.toLowerCase();

    let filteredList = groceries?.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q),
    );

    // Apply category filter
    if (selectedCategory !== "all") {
      filteredList = filteredList?.filter(
        (g) => g.category === selectedCategory,
      );
    }

    setFiltered(filteredList);
  };

  // Apply filters whenever search or category changes
  useEffect(() => {
    if (groceries) {
      let filteredList = groceries;

      // Apply search filter
      if (search) {
        const q = search.toLowerCase();
        filteredList = filteredList.filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q),
        );
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        filteredList = filteredList.filter(
          (g) => g.category === selectedCategory,
        );
      }

      setFiltered(filteredList);
    }
  }, [search, selectedCategory, groceries]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 pt-4 w-[95%] md:w-[85%] mx-auto pb-10 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl -z-10"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl -z-10"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#bfdbfe" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </motion.button>

          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <Package size={28} className="text-blue-600" />
            </motion.div>
            Manage Groceries
          </motion.h2>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-3 items-center mb-10 max-w-lg mx-auto w-full"
        >
          <motion.form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-white border border-blue-100 rounded-full px-5 py-3 shadow-md hover:shadow-lg transition-all w-full"
            whileFocus={{ scale: 1.02 }}
          >
            <Search className="text-blue-500 w-5 h-5 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              placeholder="Search by Name or Category..."
            />
          </motion.form>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-white border border-blue-100 rounded-full px-5 py-3 shadow-md hover:shadow-lg transition-all w-full md:w-auto justify-center"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium">Filter</span>
          </motion.button>
        </motion.div>

        {/* Category Filter Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-lg mx-auto mb-6"
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-blue-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-md"
              >
                <option value="all">All Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grocery List */}
        <motion.div variants={containerVariants} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered?.length === 0 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="inline-block p-4 bg-blue-50 rounded-full mb-4"
                >
                  <Package className="w-12 h-12 text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Items Found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter
                </p>
              </motion.div>
            ) : (
              filtered?.map((g, i) => (
                <motion.div
                  key={g._id?.toString() || i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
                  }}
                  layout
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-blue-100 flex flex-col sm:flex-row gap-5 p-5 sm:items-start items-center transition-all"
                >
                  <motion.div
                    className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border-2 border-blue-100 group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={g.image}
                      alt={g.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </motion.div>

                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg truncate">
                        {g.name}
                      </h3>
                      <motion.p
                        className="text-blue-600 text-sm capitalize bg-blue-50 inline-block px-3 py-1 rounded-full mt-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        {g.category}
                      </motion.p>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-blue-700 font-bold text-lg">
                        ₹{g.price} /{" "}
                        <span className="text-gray-500 text-sm font-medium ml-1">
                          {g.unit}
                        </span>
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                        onClick={() => setEditing(g)}
                      >
                        <Pencil size={15} />
                        Edit
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="flex justify-between items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Edit Grocery
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-600 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                  onClick={() => setEditing(null)}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 border-2 border-blue-200 group cursor-pointer"
              >
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editing.name}
                    fill
                    className="object-cover"
                  />
                )}
                <motion.label
                  htmlFor="imageUpload"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <Upload size={28} className="text-white" />
                  </motion.div>
                </motion.label>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="imageUpload"
                  onChange={handleImageUpload}
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Enter Grocery Name"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  <option>Select Category</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </motion.select>

                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Price"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                  value={editing.unit}
                  onChange={(e) =>
                    setEditing({ ...editing, unit: e.target.value })
                  }
                >
                  <option>Select Unit</option>
                  {units.map((u, i) => (
                    <option key={i} value={u}>
                      {u}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  onClick={handleEdit}
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader size={14} className="animate-spin" />
                    </motion.div>
                  ) : (
                    <>
                      <Edit3 size={14} />
                      Edit
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader size={14} className="animate-spin" />
                    </motion.div>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ViewGrocery;
