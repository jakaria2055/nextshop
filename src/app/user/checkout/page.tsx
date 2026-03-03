"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Signpost,
  Truck,
  User,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";

import dynamic from "next/dynamic";

const CheckOutMap = dynamic(() => import("@/components/CheckoutMap"), {
  ssr: false,
});

function Checkout() {
  const router = useRouter();

  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  // GET LOCATION
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log("Location Error", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  // SET USER DATA IN FORM
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData?.name || "" }));
      setAddress((prev) => ({ ...prev, mobile: userData?.mobile || "" }));
    }
  }, [userData]);

  //  LOCATION SEARCH
  const handleSearchQuery = async () => {
    setSearchLoading(true);
    try {
      const { OpenStreetMapProvider } = await import("leaflet-geosearch");
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });
      if (results && results.length > 0) {
        setPosition([results[0].y, results[0].x]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  // GET ADDRESS FROM MAP
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `/api/geocode?lat=${position[0]}&lon=${position[1]}`,
        );
        setAddress((prev) => ({
          ...prev,
          city: result.data.address.city || result.data.address.town || "",
          state: result.data.address.state || "",
          pincode: result.data.address.postcode || "",
          fullAddress: result.data.display_name || "",
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, [position]);

  // FETCH POST TO ORDER API CASH ON DELIVERY
  const handleCod = async () => {
    if (!position) {
      alert("Please select a location on map");
      return;
    }
    setPlaceOrderLoading(true);
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          fullAddress: address.fullAddress,
          pincode: address.pincode,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });
      router.push("/user/order-success");
    } catch (error) {
      console.log(error);
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  // FETCH POST TO ORDER API STRIPE PAYMENT
  const handleOnlinePayment = async () => {
    if (!position) {
      alert("Please select a location on map");
      return;
    }
    setPlaceOrderLoading(true);
    try {
      const result = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          fullAddress: address.fullAddress,
          pincode: address.pincode,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });

      window.location.href = result.data.url;
    } catch (error) {
      console.log(error);
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  // SET CURRENT LOCATION
  const handleCurrentLocation = () => {
    setSearchQuery("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log("Location Error", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-10"
    >
      <div className="w-[92%] md:w-[80%] mx-auto relative">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/user/cart")}
          className="absolute left-0 top-2 flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg border border-blue-100 z-10"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowLeft size={16} />
          </motion.div>
          <span>Back to Cart</span>
        </motion.button>

        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent text-center mb-10 pt-10"
        >
          Checkout
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT SIDE - DELIVERY ADDRESS */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            whileHover={{
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-blue-600" />
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Delivery Address
              </span>
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User
                  className="absolute left-3 top-3 text-blue-500"
                  size={18}
                />
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Full Name"
                  className="pl-10 w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </motion.div>

              {/* Mobile */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Phone
                  className="absolute left-3 top-3 text-blue-500"
                  size={18}
                />
                <input
                  type="text"
                  value={address.mobile}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                  placeholder="Mobile Number"
                  className="pl-10 w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </motion.div>

              {/* Full Address */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Home
                  className="absolute left-3 top-3 text-blue-500"
                  size={18}
                />
                <input
                  type="text"
                  value={address.fullAddress}
                  placeholder="Full Address"
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      fullAddress: e.target.value,
                    }))
                  }
                  className="pl-10 w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </motion.div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Building
                    className="absolute left-3 top-3 text-blue-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={address.city}
                    placeholder="City"
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="pl-10 w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </motion.div>

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Navigation
                    className="absolute left-3 top-3 text-blue-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={address.state}
                    placeholder="State"
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="pl-10 w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </motion.div>

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Signpost
                    className="absolute left-3 top-3 text-blue-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={address.pincode}
                    placeholder="Pincode"
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        pincode: e.target.value,
                      }))
                    }
                    className="pl-10 w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </motion.div>
              </div>

              {/* Search Location */}
              <div className="flex gap-2 mt-3">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Search city or area..."
                  className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchQuery()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearchQuery}
                  disabled={searchLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {searchLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Search"
                  )}
                </motion.button>
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mt-6 h-[330px] rounded-xl overflow-hidden border-2 border-blue-100 shadow-lg"
              >
                {position && (
                  <CheckOutMap position={position} setPosition={setPosition} />
                )}

                {/* Current Location Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg rounded-full p-3 hover:from-blue-600 hover:to-blue-800 transition-all flex items-center justify-center z-[1000]"
                  onClick={handleCurrentLocation}
                >
                  <LocateFixed size={22} />
                </motion.button>

                {/* Location Selected Indicator */}
                {position && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-[1000]"
                  >
                    <CheckCircle size={12} />
                    Location Selected
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - PAYMENT & ORDER SUMMARY */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            whileHover={{
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
            }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-blue-600" />
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Payment Method
              </span>
            </h2>

            {/* PAYMENT OPTION BUTTONS */}
            <div className="space-y-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                  paymentMethod === "online"
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:bg-blue-50/50"
                }`}
              >
                <motion.div
                  animate={
                    paymentMethod === "online" ? { scale: [1, 1.2, 1] } : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <CreditCardIcon className="text-blue-600" />
                </motion.div>
                <span className="font-medium text-gray-700">
                  Pay Online (Stripe)
                </span>
                {paymentMethod === "online" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <CheckCircle size={16} className="text-green-500" />
                  </motion.div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                  paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:bg-blue-50/50"
                }`}
              >
                <motion.div
                  animate={
                    paymentMethod === "cod" ? { scale: [1, 1.2, 1] } : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <Truck className="text-blue-600" />
                </motion.div>
                <span className="font-medium text-gray-700">
                  Cash on Delivery
                </span>
                {paymentMethod === "cod" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <CheckCircle size={16} className="text-green-500" />
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* BILL SUMMARY */}
            <div className="border-t border-blue-100 pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between"
              >
                <span className="font-semibold">Subtotal:</span>
                <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  ৳ {subTotal}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between"
              >
                <span className="font-semibold">Delivery Fee:</span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full ${
                    deliveryFee === 0
                      ? "bg-green-50 text-green-600"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  ৳ {deliveryFee}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-between font-bold text-lg border-t border-blue-100 pt-3"
              >
                <span>Final Total:</span>
                <span className="text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1 rounded-full">
                  ৳ {finalTotal}
                </span>
              </motion.div>
            </div>

            {/* PLACE ORDER BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              disabled={placeOrderLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              onClick={() => {
                if (paymentMethod === "cod") {
                  handleCod();
                } else {
                  handleOnlinePayment();
                }
              }}
            >
              {placeOrderLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {paymentMethod === "cod"
                    ? "Place Order"
                    : "Pay & Place Order"}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowLeft size={18} className="rotate-180" />
                  </motion.div>
                </>
              )}
            </motion.button>

            {/* Secure Payment Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-xs text-gray-500 mt-4"
            >
              🔒 Secure Payment • Your information is protected
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Checkout;
