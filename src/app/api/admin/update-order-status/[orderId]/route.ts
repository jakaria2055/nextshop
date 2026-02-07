import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    order.status = status;

    let deliveryBoysPayload: any = [];
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 20000, //NEAR BY 20 KM
          },
        },
      });
      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((b) => String(b)));
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return NextResponse.json(
          { message: "there are no available delivery boys" },
          { status: 400 },
        );
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "brodcasted",
      });

      ((order.assignment = deliveryAssignment._id),
        (deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
          id: b._id,
          name: b.name,
          mobile: b.mobile,
          latitude: b.location.coordinates[1],
          longitude: b.location.coordinates[0],
        }))));
      await deliveryAssignment.populate("order");
    }

    await order.save();
    await order.populate("user");

    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Status Update API error: ${error}`,
      },
      { status: 500 },
    );
  }
}
