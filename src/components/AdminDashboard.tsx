import React from "react";
import AdminDashboardClient from "./AdminDashboardClient";
import connectDB from "@/lib/db";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import Grocery from "@/models/groceryModel";

async function AdminDashboard() {
  await connectDB();

  const orders = await Order.find({});
  const users = await User.find({ role: "user" });
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate()-6)
  
  const todayOrders = orders.filter((o)=> new Date(o.createdAt) >= startOfDay)
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const sevenDaysOrders = orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo)
  const sevenDaysRevenue = sevenDaysOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)


  const stats = [
    {title: "Total Orders", value: totalOrders},
    {title: "Total Customers", value: totalCustomers},
    {title: "Pending Deliveries", value: pendingDeliveries},
    {title: "Total Revenue", value: totalRevenue}
  ]



  return (
    <>
      <AdminDashboardClient earning = {{
        today: todayRevenue,
        sevenDays: sevenDaysRevenue, 
        total: totalRevenue
        }} 
        stats={stats}
        />
    </>
  );
}

export default AdminDashboard;
