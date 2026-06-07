export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  eta: string;
  description: string;
  unit: string;
  isTrending?: boolean;
  isRecommended?: boolean;
};

export type OrderStatus =
  | "received"
  | "assigned"
  | "sourcing"
  | "picked"
  | "delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  items: string[];
  itemCount: number;
  total: number;
  eta: string;
  agentName: string;
  agentRating: number;
  address: string;
  createdAt: string;
  deliveredAt?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "order" | "offer" | "wallet" | "system";
  isRead: boolean;
};

export type WalletTransaction = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: string;
  color: string;
  expiresAt: string;
};

export const CATEGORIES: Category[] = [
  { id: "1", name: "Groceries", icon: "shopping-bag", color: "#34C759", count: "2000+" },
  { id: "2", name: "Pharmacy", icon: "activity", color: "#FF4D4F", count: "500+" },
  { id: "3", name: "Electronics", icon: "zap", color: "#4A90E2", count: "300+" },
  { id: "4", name: "Personal Care", icon: "smile", color: "#FF9A3D", count: "400+" },
  { id: "5", name: "Home & Kitchen", icon: "home", color: "#8B4513", count: "600+" },
  { id: "6", name: "Bakery", icon: "coffee", color: "#FF6B6B", count: "150+" },
  { id: "7", name: "Sports", icon: "trending-up", color: "#111111", count: "200+" },
  { id: "8", name: "Pet Supplies", icon: "feather", color: "#9B59B6", count: "180+" },
  { id: "9", name: "Stationery", icon: "edit-2", color: "#3498DB", count: "250+" },
  { id: "10", name: "Beverages", icon: "droplet", color: "#1ABC9C", count: "300+" },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Organic Whole Milk",
    category: "Groceries",
    price: 68,
    originalPrice: 80,
    eta: "15 min",
    description: "500ml full cream organic milk from local farms",
    unit: "500ml",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p2",
    name: "Paracetamol 500mg",
    category: "Pharmacy",
    price: 28,
    eta: "20 min",
    description: "Strip of 10 tablets. Relieves pain and fever.",
    unit: "10 tablets",
    isTrending: true,
  },
  {
    id: "p3",
    name: "USB-C Fast Charger",
    category: "Electronics",
    price: 599,
    originalPrice: 799,
    eta: "35 min",
    description: "65W fast charging adapter with 1m cable",
    unit: "1 piece",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p4",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 45,
    eta: "18 min",
    description: "400g freshly baked whole wheat sandwich bread",
    unit: "400g",
    isRecommended: true,
  },
  {
    id: "p5",
    name: "Vitamin C 1000mg",
    category: "Pharmacy",
    price: 299,
    originalPrice: 349,
    eta: "25 min",
    description: "60 effervescent tablets for immunity",
    unit: "60 tablets",
    isTrending: true,
    isRecommended: true,
  },
  {
    id: "p6",
    name: "Almond Butter",
    category: "Groceries",
    price: 349,
    eta: "22 min",
    description: "200g pure almond butter, no added sugar",
    unit: "200g",
    isRecommended: true,
  },
  {
    id: "p7",
    name: "Hand Sanitizer",
    category: "Personal Care",
    price: 89,
    eta: "15 min",
    description: "500ml 70% isopropyl alcohol sanitizer",
    unit: "500ml",
    isTrending: true,
  },
  {
    id: "p8",
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 1299,
    originalPrice: 1999,
    eta: "40 min",
    description: "True wireless earbuds with 24hr battery",
    unit: "1 pair",
    isRecommended: true,
  },
];

export const ACTIVE_ORDERS: Order[] = [
  {
    id: "ORD9A2F",
    status: "delivery",
    items: ["Organic Whole Milk x2", "Whole Wheat Bread x1"],
    itemCount: 3,
    total: 181,
    eta: "8 min",
    agentName: "Rahul K.",
    agentRating: 4.9,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "2:30 PM",
  },
];

export const PAST_ORDERS: Order[] = [
  {
    id: "ORD7B1C",
    status: "delivered",
    items: ["Vitamin C 1000mg x1", "Paracetamol 500mg x2"],
    itemCount: 3,
    total: 355,
    eta: "25 min",
    agentName: "Priya M.",
    agentRating: 5.0,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "Yesterday",
    deliveredAt: "6:15 PM",
  },
  {
    id: "ORD6C3D",
    status: "delivered",
    items: ["USB-C Fast Charger x1", "Wireless Earbuds x1"],
    itemCount: 2,
    total: 1898,
    eta: "45 min",
    agentName: "Amit S.",
    agentRating: 4.7,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "2 days ago",
    deliveredAt: "3:40 PM",
  },
  {
    id: "ORD5D4E",
    status: "delivered",
    items: ["Almond Butter x2", "Organic Whole Milk x1"],
    itemCount: 3,
    total: 766,
    eta: "20 min",
    agentName: "Sneha P.",
    agentRating: 4.8,
    address: "Flat 4B, Sunrise Apartments, Koramangala",
    createdAt: "4 days ago",
    deliveredAt: "11:20 AM",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Order on the way!",
    message: "Rahul K. is heading to you with your order. ETA: 8 minutes.",
    time: "2 min ago",
    type: "order",
    isRead: false,
  },
  {
    id: "n2",
    title: "Limited time offer",
    message: "Get 20% off on your next Pharmacy order. Use code HEALTH20.",
    time: "1 hour ago",
    type: "offer",
    isRead: false,
  },
  {
    id: "n3",
    title: "Order delivered",
    message: "Your order ORD7B1C was delivered successfully. Rate your experience.",
    time: "Yesterday",
    type: "order",
    isRead: true,
  },
  {
    id: "n4",
    title: "Cashback credited",
    message: "₹50 cashback added to your wallet for order ORD7B1C.",
    time: "Yesterday",
    type: "wallet",
    isRead: true,
  },
  {
    id: "n5",
    title: "Weekend special",
    message: "Free delivery on orders above ₹199 this weekend.",
    time: "2 days ago",
    type: "offer",
    isRead: true,
  },
];

export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: "t1", type: "debit", amount: 181, description: "Order ORD9A2F", date: "Today" },
  { id: "t2", type: "credit", amount: 50, description: "Cashback - ORD7B1C", date: "Yesterday" },
  { id: "t3", type: "debit", amount: 355, description: "Order ORD7B1C", date: "Yesterday" },
  { id: "t4", type: "credit", amount: 500, description: "Added via UPI", date: "3 days ago" },
  { id: "t5", type: "debit", amount: 1898, description: "Order ORD6C3D", date: "2 days ago" },
  { id: "t6", type: "credit", amount: 200, description: "Referral bonus", date: "1 week ago" },
  { id: "t7", type: "credit", amount: 1000, description: "Added via UPI", date: "1 week ago" },
];

export const OFFERS: Offer[] = [
  {
    id: "o1",
    title: "First order",
    subtitle: "50% off up to ₹100",
    code: "FIRST50",
    discount: "50% OFF",
    color: "#FF9A3D",
    expiresAt: "Dec 31",
  },
  {
    id: "o2",
    title: "Groceries special",
    subtitle: "Free delivery on groceries",
    code: "FREEGROC",
    discount: "FREE DELIVERY",
    color: "#34C759",
    expiresAt: "Dec 25",
  },
  {
    id: "o3",
    title: "Health & pharma",
    subtitle: "20% off medicines",
    code: "HEALTH20",
    discount: "20% OFF",
    color: "#4A90E2",
    expiresAt: "Dec 20",
  },
];

export const ORDER_STATUS_STEPS = [
  { key: "received", label: "Order Received", icon: "check-circle" },
  { key: "assigned", label: "Agent Assigned", icon: "user" },
  { key: "sourcing", label: "Sourcing Product", icon: "search" },
  { key: "picked", label: "Pickup Complete", icon: "package" },
  { key: "delivery", label: "Out for Delivery", icon: "navigation" },
  { key: "delivered", label: "Delivered", icon: "check-circle" },
];
