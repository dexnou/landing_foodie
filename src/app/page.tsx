import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Home",
  description: "Food Delivery Day 2026: agenda, sponsors y entradas.",
};

export default function Page() {
  return <HomeClient />;
}
