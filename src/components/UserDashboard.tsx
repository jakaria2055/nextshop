import React from "react";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import connectDB from "@/lib/db";
import Grocery from "@/models/groceryModel";
import GroceryItemCard from "./GroceryItemCard";

async function UserDashboard() {
  await connectDB();
  const groceries = await Grocery.find({});
  const plainGrocery = JSON.parse(JSON.stringify(groceries));

  return (
    <div>
      <HeroSection />
      <CategorySlider />
      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center border-b-2 border-blue-100">
          🥦Popular Items
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGrocery.map((item: any, index: number) => (
            <GroceryItemCard item={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
