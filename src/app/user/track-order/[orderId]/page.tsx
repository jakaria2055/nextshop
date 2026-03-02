"use client";
import { IOrder } from "@/models/orderModel";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ArrowLeft, Loader2, Send, Sparkle, MapPin, Truck, User, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/messageModel";
import { AnimatePresence } from "motion/react";
import { motion } from "framer-motion";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
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

function TrackOrder({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage>();
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${orderId}`);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });
        setDeliveryBoyLocation({
          latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
        });
      } catch (error) {
        console.log(error);
      }
    };
    getOrder();
  }, [userData?._id]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", (data) => {
      setDeliveryBoyLocation({
        latitude: data.location.coordinates[1] ?? data.location.latitude,
        longitude: data.location.coordinates[0] ?? data.location.longitude,
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, [order]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev!, message]);
      }
    });

    return () => {
      socket.off("send-message");
    };
  }, []);

  const sendMsg = () => {
    if (!newMessage.trim()) return;
    
    const socket = getSocket();
    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send-message", message);
    setNewMessage("");
  };

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post(`/api/chat/messages`, {
          roomId: orderId,
        });
        setMessages(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const getSuggestion = async () => {
    setLoading(true);
    try {
      const lastMessage = messages
        ?.filter((m) => m.senderId !== userData?._id)
        ?.at(-1);
      const result = await axios.post(`/api/chat/ai-suggestions`, {
        message: lastMessage?.text,
        role: "user",
      });
      setSuggestions(result.data);
      setShowSuggestions(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 relative overflow-hidden"
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

      <div className="max-w-2xl mx-auto pb-24 relative z-10">
        {/* Sticky Header */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b border-blue-100 shadow-lg flex gap-3 items-center z-[999]"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-all shadow-md"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} className="text-blue-700" />
          </motion.button>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Track Order
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span>Order #{order?._id?.toString().slice(-6).toUpperCase()}</span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order?.status === "out of delivery"
                    ? "bg-blue-100 text-blue-700"
                    : order?.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order?.status}
              </motion.span>
            </p>
          </motion.div>
        </motion.div>

        <div className="px-4 mt-6 space-y-4">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)" }}
            className="rounded-3xl overflow-hidden border-2 border-blue-100 shadow-xl"
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
            className="grid grid-cols-2 gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 shadow-md"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <User size={14} />
                <span className="text-xs font-semibold">Your Location</span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 shadow-md"
            >
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <Truck size={14} />
                <span className="text-xs font-semibold">Delivery Boy</span>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {deliveryBoyLocation.latitude.toFixed(4)}, {deliveryBoyLocation.longitude.toFixed(4)}
              </p>
            </motion.div>
          </motion.div>

          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-4 h-[450px] flex flex-col"
          >
            {/* AI Chat Header */}
            <motion.div 
              className="flex justify-between items-center mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <Clock size={14} className="text-blue-600" />
                Quick Replies
              </span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="px-3 py-1 text-xs flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg border border-purple-300 cursor-pointer disabled:opacity-70"
                onClick={getSuggestion}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  {loading ? <Loader2 size={14} /> : <Sparkle size={14} />}
                </motion.div>
                {loading ? "Thinking..." : "AI Suggest"}
              </motion.button>
            </motion.div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 flex-wrap mb-3 overflow-hidden"
                >
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 rounded-full shadow-sm hover:shadow-md transition-all"
                      onClick={() => setNewMessage(s)}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Container */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
              ref={chatBoxRef}
            >
              <AnimatePresence mode="popLayout">
                {messages?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block p-3 bg-blue-50 rounded-full mb-2"
                    >
                      <Send size={24} className="text-blue-400" />
                    </motion.div>
                    <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                  </motion.div>
                ) : (
                  messages?.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`flex ${msg.senderId == userData?._id ? "justify-end" : "justify-start"}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-md 
                          ${
                            msg.senderId === userData?._id
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                          }`}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${
                          msg.senderId === userData?._id ? "text-blue-100" : "text-gray-400"
                        }`}>
                          {msg.time}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <motion.div 
              className="flex gap-2 mt-3 border-t border-blue-100 pt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="flex-1 relative"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
                />
                {newMessage && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 text-xs text-blue-600"
                  >
                    ↵
                  </motion.span>
                )}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl text-white transition-all ${
                  newMessage.trim() 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={sendMsg}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default TrackOrder;