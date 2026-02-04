"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Building, Code, Home, MapPin, Navigation, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function Checkout() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const [address, setAddress] = useState({
    fullName: userData?.name,
    mobile: userData?.mobile,
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });


  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        onClick={() => router.push("/user/cart")}
        className="absolute left-0 top-2 flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft size={16} />
        <span className="">Back to Cart</span>
      </motion.button>

      <motion.h1 className="text-3xl md:text-4xl font-bold text-blue-700 text-center mb-10">
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-blue-700" />
            Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="relative">
                <User className="absolute left-3 top-3 text-green-600"  size={18}/>
                <input type="text" value={address.fullName}  onChange={(e)=> setAddress({...address, fullName:e.target.value})} className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"/>
            </div>
            <div className="relative">
                <Phone className="absolute left-3 top-3 text-green-600"  size={18}/>
                <input type="text" value={address.mobile} onChange={(e)=> setAddress({...address, fullName:e.target.value})} className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"/>
            </div>
             <div className="relative">
                <Home className="absolute left-3 top-3 text-green-600"  size={18}/>
                <input type="text" value={address.fullAddress} placeholder="Full Address" onChange={(e)=> setAddress({...address, fullAddress:e.target.value})} className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"/>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                <Building className="absolute left-3 top-3 text-green-600"  size={18}/>
                <input type="text" value={address.city} placeholder="City" onChange={(e)=> setAddress({...address, city:e.target.value})} className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"/>
                </div>

                <div className="relative">
                <Navigation className="absolute left-3 top-3 text-green-600"  size={18}/>
                <input type="text" value={address.state} placeholder="State" onChange={(e)=> setAddress({...address, state:e.target.value})} className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"/>
                </div>

                <div className="relative">
                <Code className="absolute left-3 top-3 text-green-600"  size={18}/>
                <input type="text" value={address.pincode} placeholder="pinCode" onChange={(e)=> setAddress({...address, pincode:e.target.value})} className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"/>
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                <input type="text" placeholder="search city or area..." className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none"/>
                <button className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition-all font-medium">Search</button>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
