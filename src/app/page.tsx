import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/UserDashboard";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { redirect } from "next/navigation";
import React from "react";

async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />

      {user.role == "user" ? (
        <UserDashboard />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
}

export default Home;

//Next
