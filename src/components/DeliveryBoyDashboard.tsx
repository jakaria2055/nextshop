"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import DeliveryChat from "./DeliveryChat";

const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

interface ILocation {
  latitude: number;
  longitude: number;
}

function DeliveryBoyDashboard() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
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
      console.log(result);
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

    return ()=> socket.off("update-deliveryBoy-location")
  }, []);

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignments();
  }, [userData]);

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 pt-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Order# {activeOrder.order._id.slice(-6)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          <DeliveryChat
            orderId={activeOrder.order._id}
            deliveryBoyId={userData?._id!}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 pt-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-3 mt-[120px] text-gray-800 ">
          Delivery Assignments
        </h2>
        {assignments.map((a, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl shadow mb-4 border"
          >
            <p>
              <b>Order Id: </b> #{a?.order._id.slice(-6)}
            </p>
            <p className="text-gray-600">{a.order.address.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700  text-white py-2 rounded-lg "
                onClick={(e) => handleAccept(a._id)}
              >
                Accept
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700  text-white py-2 rounded-lg ">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;
