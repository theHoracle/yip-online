import { NextResponse } from "next/server";
import orders from "@/data/orders.json";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(orders);
}
