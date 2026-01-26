"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bike, PhoneCallIcon, User, UserCog } from "lucide-react";
import axios from "axios";
import { redirect } from "next/navigation";


function EditRoleMobile() {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");

  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile
      })
      redirect("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 w-full">
      <motion.h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 text-center mt-8">
        Select You Role
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole == role.id;

          return (
            <motion.div
              key={role.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${isSelected ? "border-blue-600 bg-blue-100 shadow-lg" : "border-gray-300 bg-white hover:border-blue-400"}`}
            >
              <Icon />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div className="flex flex-col items-center mt-10">
        <label
          htmlFor="mobile"
          className="text-gray-700 font-medium mb-2 flex items-center gap-2"
        >
          Enter Mobile Number <PhoneCallIcon className="w-5 h-5" />
        </label>
        <input
          type="tel"
          onChange={(e) => setMobile(e.target.value)}
          id="mobile"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
          placeholder="+880 123456789"
        />
      </motion.div>

      <div className="flex flex-col items-center">
        <motion.button
        disabled={mobile.length!==11 || !selectedRole}
          className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-300 w-[200px] mt-10 ${selectedRole && mobile.length === 11 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          onClick={handleEdit}
        >
          Go to Home
          <ArrowRight />
        </motion.button>
      </div>
    </div>
  );
}

export default EditRoleMobile;
