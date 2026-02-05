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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/14831/14831599.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
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

  // DRAGABLE LOCATION ICON FOR SET LOCATION
  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [position, map]);
    return (
      <Marker
        icon={markerIcon}
        position={position as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  };

  //  LOCATION SEARCH
  const handleSearchQuery = async () => {
    setSearchLoading(true);
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results) {
      setSearchLoading(false);
      setPosition([results[0].y, results[1].x]);
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
          city: result.data.address.city,
          state: result.data.address.state,
          pincode: result.data.address.postcode,
          fullAddress: result.data.display_name,
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
      return null;
    }
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
    }
  };

    // FETCH POST TO ORDER API STRIPE PAYMENT
  const handleOnlinePayment = async () => {
    if (!position) {
      return null;
    }
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
      console.log(error)
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
        {/* LEFT SIDE */}
        <motion.div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-blue-700" />
            Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
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
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
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
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.city}
                  placeholder="City"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state}
                  placeholder="State"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              <div className="relative">
                <Signpost
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.pincode}
                  placeholder="pinCode"
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearchQuery}
                className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                {searchLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && (
                <MapContainer
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <DraggableMarker />
                </MapContainer>
              )}
              <motion.button
                whileTap={{ scale: 0.93 }}
                className="absolute bottom-4 right-4 bg-blue-600 text-white shadow-lg rounded-full p-3 hover:bg-blue-700 transition-all flex items-center justify-center z-999"
                onClick={handleCurrentLocation}
              >
                <LocateFixed size={22} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Payment Method
          </h2>

          {/* PAYMENT OPTION BUTTON */}
          <div className="space-y-4 mb-6">
            <button
              onClick={(e) => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "online" ? "border-blue-600 bg-blue-50 shadow-sm" : "hover:bg-gray-50"}`}
            >
              <CreditCardIcon className="text-blue-600" />
              <span className="font-medium text-gray-700">
                Pay Online (Stripe)
              </span>
            </button>

            <button
              onClick={(e) => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50 shadow-sm" : "hover:bg-gray-50"}`}
            >
              <Truck className="text-blue-600" />
              <span className="font-medium text-gray-700">
                Cash on Delivery
              </span>
            </button>
          </div>

          {/* BILL SLIP */}
          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal: </span>
              <span className="font-semibold text-blue-700">৳ {subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">DeliveryFee: </span>
              <span className="font-semibold text-blue-700">
                ৳ {deliveryFee}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span className="">Final Total: </span>
              <span className="font-semibold text-blue-700">
                ৳ {finalTotal}
              </span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-all font-semibold"
            onClick={() => {
              if (paymentMethod == "cod") {
                handleCod();
              } else {
                handleOnlinePayment();
              }
            }}
          >
            {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
