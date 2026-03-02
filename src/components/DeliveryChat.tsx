import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/messageModel";
import axios from "axios";
import { Loader2, Send, Sparkle, Clock } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

function DeliveryChat({ orderId, deliveryBoyId }: props) {
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage>();
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

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
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send-message", message);
    setNewMessage("");
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

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

  const getSuggestion = async () => {
    setLoading(true);
    try {
      const lastMessage = messages
        ?.filter((m) => m.senderId !== deliveryBoyId)
        ?.at(-1);
      const result = await axios.post(`/api/chat/ai-suggestions`, {
        message: lastMessage?.text,
        role: "delivery_boy",
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-4 h-[450px] flex flex-col"
    >
      {/* AI Chat Header */}
      <motion.div 
        className="flex justify-between items-center mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
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
                className={`flex ${msg.senderId == deliveryBoyId ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-md 
                    ${
                      msg.senderId === deliveryBoyId
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${
                    msg.senderId === deliveryBoyId ? "text-blue-100" : "text-gray-400"
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
        transition={{ delay: 0.2 }}
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
  );
}

export default DeliveryChat;