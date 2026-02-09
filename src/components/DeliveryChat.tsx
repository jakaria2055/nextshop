import { getSocket } from "@/lib/socket";
import { time } from "console";
import { Send } from "lucide-react";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";

type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

function DeliveryChat({ orderId, deliveryBoyId }: props) {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
  }, []);

  const sendMsg = () => {
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

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col">
      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          placeholder="Type a Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl text-white"
          onClick={sendMsg}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default DeliveryChat;
