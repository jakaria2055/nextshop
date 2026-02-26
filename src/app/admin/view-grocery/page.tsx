"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Package, Pencil, Search, X } from "lucide-react";
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
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries");
        setGroceries(result.data);
        console.log(result);
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

  return (
    <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-10">
      <motion.div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto"
        >
          <ArrowLeft size={18} />
          <span>Back to DashBoard</span>
        </button>
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 flex items-center justify-center gap-2">
          <Package size={28} className="text-blue-600" /> Manage Groceries
        </h2>
      </motion.div>

      <motion.form className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
          placeholder="Search by Name or Category..."
        />
      </motion.form>

      <div className="space-y-4">
        {groceries?.map((g, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row  gap-5 p-5 sm:items-start items-center  transition-all"
          >
            <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={g.image}
                alt={g.name}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {g.name}
                </h3>
                <p className="text-gray-500 text-sm capitalize">{g.category}</p>
              </div>

              <div className="mt-3 flex flex-col  sm:flex-row  sm:items-center sm:justify-between gap-2">
                <p className="text-blue-700 font-bold text-lg">
                  {g.price} /{" "}
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    {g.unit}
                  </span>
                </p>

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                  onClick={() => setEditing(g)}
                >
                  <Pencil size={15} />
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4">
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-700">
                  Edit Grocery
                </h2>
                <button
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => setEditing(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editing.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Grocery Name"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                </select>

                <input
                  type="text"
                  placeholder="Price"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                </select>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewGrocery;
