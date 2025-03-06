"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDownUp,
  ArrowUpDown,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderFilters({
  statusFilter,
  setStatusFilter,
  sortConfig,
  setSortConfig,
}: {
  statusFilter: any;
  setStatusFilter: any;
  sortConfig: any;
  setSortConfig: any;
}) {
  // Handle status filter change
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Handle sort change
  const handleSortChange = (key) => {
    if (sortConfig.key === key) {
      // Toggle direction if same key
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Default to descending for new key
      setSortConfig({
        key,
        direction: "desc",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium mb-1 block">
              Filter by Status
            </label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium mb-1 block">Sort by</label>
            <div className="flex gap-2">
              <Button
                variant={sortConfig.key === "timestamp" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange("timestamp")}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Date
                {sortConfig.key === "timestamp" &&
                  (sortConfig.direction === "asc" ? (
                    <ArrowUpAZ className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownAZ className="h-4 w-4 ml-1" />
                  ))}
              </Button>

              <Button
                variant={
                  sortConfig.key === "totalPrice" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleSortChange("totalPrice")}
                className="flex items-center gap-1"
              >
                <DollarSign className="h-4 w-4" />
                Price
                {sortConfig.key === "totalPrice" &&
                  (sortConfig.direction === "asc" ? (
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownUp className="h-4 w-4 ml-1" />
                  ))}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
