type Order = {
  id: string;
  customer: string;
  items: string[];
  totalPrice: number;
  status: "Pending" | "Completed";
  timestamp: string;
};
