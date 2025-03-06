import { type NextRequest, NextResponse } from "next/server";
import orders from "@/data/orders.json";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const body = await request.json();

  // find the order
  const orderIndex = orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // update the order
  orders[orderIndex] = {
    ...orders[orderIndex],
    ...body,
  };

  // to simmulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(orders[orderIndex]);
}
