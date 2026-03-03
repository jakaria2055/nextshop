"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import DeliveryChat from "./DeliveryChat";
import {
  Loader2,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[500px] rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-2"
        >
          <Loader2 className="w-8 h-8 text-blue-600" />
        </motion.div>
        <p className="text-blue-700 font-medium">Loading map...</p>
      </div>
    </motion.div>
  ),
});

interface ILocation {
  latitude: number;
  longitude: number;
}

function DeliveryBoyDashboard({ earning }: { earning: number }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const fetchAssignments = async () => {
    try {
      const result = await axios.get(`/api/delivery/get-assignments`);
      setAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = getSocket();

    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });
        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();

    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`,
      );
      fetchCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get(`/api/delivery/current-order`);
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });

    return () => socket.off("update-deliveryBoy-location");
  }, []);


  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      await fetchCurrentOrder();
      await fetchAssignments();
    };

    fetchData();
  }, [userData]);


  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder.order._id,
      });
      console.log(result.data);
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post("/api/delivery/otp/verify", {
        orderId: activeOrder.order._id,
        otp,
      });
      console.log(result.data);
      setActiveOrder(null);
      setVerifyOtpLoading(false);
      await fetchCurrentOrder();
      window.location.reload();
    } catch (error) {
      setOtpError("OTP verification error!");
      setVerifyOtpLoading(false);
    }
  };

  // No Active Deliveries State
  if (!activeOrder && assignments.length === 0) {
    const todayEarning = [
      {
        name: "Today",
        earnings: earning,
        deliveries: earning / 40,
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center p-6 relative overflow-hidden"
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="max-w-md w-full text-center relative z-10"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Truck size={80} className="text-blue-500" />
          </motion.div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
            No Active Deliveries
          </h2>
          <p className="text-gray-500 mb-8">
            Stay online to receive new orders!
          </p>

          <motion.div
            whileHover={{
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
            }}
            className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-xl p-6"
          >
            <h2 className="font-semibold text-blue-700 mb-4 flex items-center justify-center gap-2">
              <DollarSign size={18} />
              {"Today's Performance"}
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={todayEarning}>
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="earnings"
                  name="Earning (৳)"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="deliveries"
                  name="Deliveries"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 text-2xl font-bold text-blue-700"
            >
              ৳ {earning || 0} Earned today
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              Refresh Earnings
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Active Delivery State
  if (activeOrder && userLocation) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-4 pt-24 relative overflow-hidden"
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

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Active Delivery
            </h1>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <span>Order #</span>
              <span className="font-mono font-bold text-blue-700">
                {activeOrder.order._id.slice(-6).toUpperCase()}
              </span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
            </p>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
            }}
            className="rounded-2xl border-2 border-blue-100 shadow-xl overflow-hidden mb-6"
          >
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </motion.div>

          {/* Location Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 shadow-md"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <MapPin size={14} />
                <span className="text-xs font-semibold">Customer Location</span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {userLocation.latitude.toFixed(4)},{" "}
                {userLocation.longitude.toFixed(4)}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 shadow-md"
            >
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <Truck size={14} />
                <span className="text-xs font-semibold">Your Location</span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {deliveryBoyLocation.latitude.toFixed(4)},{" "}
                {deliveryBoyLocation.longitude.toFixed(4)}
              </p>
            </motion.div>
          </motion.div>

          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {userData?._id && (
              <DeliveryChat
                orderId={activeOrder.order._id}
                deliveryBoyId={userData._id.toString()}
              />
            )}
          </motion.div>

          {/* OTP Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-xl p-6"
          >
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendOtp}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl text-center hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                {sendOtpLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  "Mark as Delivered"
                )}
              </motion.button>
            )}

            <AnimatePresence>
              {showOtpBox && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    className="w-full py-3 border-2 border-blue-200 rounded-xl text-center text-lg font-bold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter OTP"
                    maxLength={4}
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={verifyOtp}
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                  >
                    {verifyOtpLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </motion.button>

                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg"
                    >
                      {otpError}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {activeOrder.order.deliveryOtpVerification && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block mb-2"
                >
                  <CheckCircle size={48} className="text-green-500" />
                </motion.div>
                <p className="text-green-600 font-bold text-lg">
                  Delivery Completed!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Assignments List State
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-4 pt-24 relative overflow-hidden"
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

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-6"
        >
          Delivery Assignments
        </motion.h2>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {assignments.map((a, index) => (
            <motion.div
              key={index}
              variants={{
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
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
              }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-5 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">
                  Order #{a?.order._id.slice(-6).toUpperCase()}
                </p>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-yellow-500 rounded-full"
                />
              </div>

              <p className="text-gray-600 text-sm mb-4 flex items-start gap-2">
                <MapPin
                  size={14}
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                />
                <span>{a.order.address.fullAddress}</span>
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  onClick={(e) => handleAccept(a._id)}
                >
                  <CheckCircle size={16} />
                  Accept
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={16} />
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DeliveryBoyDashboard;
