"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bike, PhoneCallIcon, User, UserCog, CheckCircle } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function EditRoleMobile() {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog, color: "from-purple-500 to-purple-600", lightBg: "bg-purple-50" },
    { id: "user", label: "User", icon: User, color: "from-blue-500 to-blue-600", lightBg: "bg-blue-50" },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike, color: "from-green-500 to-green-600", lightBg: "bg-green-50" },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  const handleEdit = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      await update({ role: selectedRole });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin");
        setRoles((prev) => prev.filter((r) => r.id !== "admin"));
      } catch (error) {
        console.log(error);
      }
    };
    checkForAdmin();
  }, []);

  const isFormValid = selectedRole && mobile.trim().length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-2xl border border-blue-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block mb-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Choose Your Role
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-sm"
          >
            Select how you want to use NextShop
          </motion.p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.id)}
                className={`relative cursor-pointer rounded-xl p-6 transition-all ${
                  isSelected 
                    ? `bg-gradient-to-br ${role.color} text-white shadow-lg` 
                    : `bg-white border-2 border-gray-200 hover:border-${role.id === 'admin' ? 'purple' : role.id === 'user' ? 'blue' : 'green'}-300`
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={isSelected ? { rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`p-3 rounded-full mb-3 ${
                      isSelected 
                        ? 'bg-white/20' 
                        : role.lightBg
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${
                      isSelected 
                        ? 'text-white' 
                        : role.id === 'admin' 
                          ? 'text-purple-600' 
                          : role.id === 'user' 
                            ? 'text-blue-600' 
                            : 'text-green-600'
                    }`} />
                  </motion.div>
                  
                  <h3 className={`font-semibold ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}>
                    {role.label}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    isSelected ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {role.id === 'admin' ? 'Full access' : 
                     role.id === 'user' ? 'Shop & order' : 
                     'Deliver orders'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Number Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <PhoneCallIcon className={`w-5 h-5 transition-colors ${
                focusedInput ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${
                focusedInput 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : mobile
                    ? 'border-green-500 bg-green-50/30'
                    : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Enter your mobile number"
            />
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <motion.button
            disabled={!isFormValid}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            onClick={handleEdit}
            className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isFormValid
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Continue to Dashboard</span>
            {isFormValid && (
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-400 mt-4"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default EditRoleMobile;