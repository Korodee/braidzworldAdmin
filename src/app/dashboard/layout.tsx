"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import BottomNav from "./components/bottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Bookings Management", href: "/dashboard/bookings" },
    { name: "Gallery", href: "/dashboard/gallery" },
    { name: "Availability Calendar", href: "/dashboard/availability" },
    { name: "News", href: "/dashboard/news" },
    { name: "History", href: "/dashboard/history" },
  ];

  const activePage =
    navigation.find((item) => item.href === pathname)?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-white">
      <div className="md:w-64">
        <Sidebar />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[100svh]">
        <Navbar activePage={activePage} />
        <main
          className="flex-1 bg-red pb-20 md:pb-0 
     overflow-y-auto"
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
