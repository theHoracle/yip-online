"use client";

import React from "react";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock } from "lucide-react";

// Memoized order row component for performance
const OrderRow = ({
  order,
  onCompleteOrder,
}: {
  order: Order;
  onCompleteOrder: (orderId: string) => void;
}) => {
  const formattedDate = new Date(order.timestamp).toLocaleString();

  return (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.id}</TableCell>
      <TableCell>{order.customer}</TableCell>
      <TableCell>
        <ul className="list-disc pl-5">
          {order.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </TableCell>
      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
      <TableCell>
        <Badge
          variant={order.status === "Completed" ? "secondary" : "default"}
          className={
            order.status === "Completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {order.status === "Completed" ? (
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
          ) : (
            <Clock className="h-3.5 w-3.5 mr-1" />
          )}
          {order.status}
        </Badge>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        {order.status === "Pending" && (
          <Button
            size="sm"
            onClick={() => onCompleteOrder(order.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete Order
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

// Memoize the OrderRow component
const MemoizedOrderRow = React.memo(OrderRow);

export default function OrdersTable({
  orders,
  loading,
  statusFilter,
  sortConfig,
  onCompleteOrder,
}: {
  orders: Order[];
  loading: boolean;
  statusFilter: string;
  sortConfig: any;
  onCompleteOrder: (orderId: string) => void;
}) {
  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    // First filter by status
    const filtered =
      statusFilter === "all"
        ? orders
        : orders.filter((order: Order) => order.status === statusFilter);

    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortConfig.key === "timestamp") {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === "totalPrice") {
        return sortConfig.direction === "asc"
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice;
      }
      return 0;
    });
  }, [orders, statusFilter, sortConfig]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(7)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedOrders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedOrders.map((order) => (
              <MemoizedOrderRow
                key={order.id}
                order={order}
                onCompleteOrder={onCompleteOrder}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
