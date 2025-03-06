"use client";

import { useState, useEffect, useCallback } from "react";
import OrdersTable from "@/components/orders-table";
import OrderFilters from "@/components/order-filters";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });

  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      console.log("Data: ", data);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast("Error", {
        description: "Failed to fetch order. Try again later.",
        action: {
          label: "Refresh",
          onClick: () => router.refresh(),
        },
      });
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();

    // polling for real-time updates (every 20 seconds)
    const intervalId = setInterval(fetchOrders, 20000);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  // Handle marking order as completed
  const handleCompleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: "Completed" } : order,
          ),
        );

        toast("Order Completed", {
          description: `Order ${orderId} has been marked as completed.`,
        });
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast("Error", {
        description: "Failed to complete order. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-7xl px-4 md:px-10 lg:px-20 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Orders</h1>

      <OrderFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />
      <OrdersTable
        orders={orders}
        loading={loading}
        statusFilter={statusFilter}
        sortConfig={sortConfig}
        onCompleteOrder={handleCompleteOrder}
      />
    </div>
  );
}
