import mongoose from "mongoose";
interface IGrocery {
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, floor & Grains",
        "Snacks & Buscuits",
        "Spices & Masalas",
        "Beverages & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant & Packaged Food",
        "Baby & Pet Care",
      ],
      required: true,
    },
    price: { type: String, required: true },
    unit: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);

export default Grocery;
