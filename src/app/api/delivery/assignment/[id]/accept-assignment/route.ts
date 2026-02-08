import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "assignment not found!" },
        { status: 404 },
      );
    }

    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "assignment expired!" },
        { status: 400 },
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "already assigned to other order" },
        { status: 400 },
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json(
        { message: "order not found!" },
        { status: 404 },
      );
    }
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "brodcasted",
      },
      {
        $pull: { broadcastedTo: deliveryBoyId },
      },
    );

    return NextResponse.json(
      { message: "order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `accept assignment API error: ${error}` },
      { status: 500 },
    );
  }
}
