"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ScissorsIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  userName: string;
  userEmail: string;
  hairstyle: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "paid" | "pending";
  amount: number;
}

interface ModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function BookingActionModal({ booking, onClose, onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {booking.status === "pending" ? "Booking Action Required" : "Booking Details"}
        </h3>
        <div className="mb-6">
          <div className="bg-gray-100 text-black rounded-lg p-4 space-y-2">
            <p><span className="font-medium">Client:</span> {booking.userName}</p>
            <p><span className="font-medium">Hairstyle:</span> {booking.hairstyle}</p>
            <p><span className="font-medium">Date:</span> {booking.date}</p>
            <p><span className="font-medium">Time:</span> {booking.time}</p>
            <p><span className="font-medium">Payment Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-sm
                ${booking.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}
              `}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </span>
            </p>
            <p><span className="font-medium">Amount:</span> ${booking.amount}</p>
          </div>
        </div>
        {booking.status === "pending" && onConfirm && onCancel ? (
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckIcon className="h-5 w-5" />
              Confirm Booking
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <XMarkIcon className="h-5 w-5" />
              Cancel Booking
            </button>
          </div>
        ) : null}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Close Modal
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 50,
    pendingBookings: 15,
    confirmedBookings: 20,
    cancelledBookings: 15,
  });

  const [recentBookings, setRecentBookings] = useState<Booking[]>([
    {
      id: "1",
      date: "Jul 11, 2025",
      time: "17:00",
      userName: "Michelle Edwards",
      userEmail: "michelle.e@example.com",
      hairstyle: "Haircut",
      status: "confirmed",
      paymentStatus: "paid",
      amount: 25,
    },
    {
      id: "2",
      date: "Jul 9, 2025",
      time: "12:30",
      userName: "Kevin Morris",
      userEmail: "kevin.m@example.com",
      hairstyle: "Facial",
      status: "confirmed",
      paymentStatus: "paid",
      amount: 25,
    },
    {
      id: "3",
      date: "Jul 8, 2025",
      time: "09:00",
      userName: "Sandra Rogers",
      userEmail: "sandra.r@example.com",
      hairstyle: "Styling",
      status: "confirmed",
      paymentStatus: "paid",
      amount: 25,
    },
    {
      id: "4",
      date: "Jul 6, 2025",
      time: "12:00",
      userName: "Karen Mitchell",
      userEmail: "karen.m@example.com",
      hairstyle: "Manicure",
      status: "pending",
      paymentStatus: "pending",
      amount: 25,
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleConfirmBooking = () => {
    if (selectedBooking) {
      setRecentBookings(bookings =>
        bookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "confirmed" }
            : booking
        )
      );
      setStats(prev => ({
        ...prev,
        pendingBookings: prev.pendingBookings - 1,
        confirmedBookings: prev.confirmedBookings + 1,
      }));
      setSelectedBooking(null);
    }
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      setRecentBookings(bookings =>
        bookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
      setStats(prev => ({
        ...prev,
        pendingBookings: prev.pendingBookings - 1,
        cancelledBookings: prev.cancelledBookings + 1,
      }));
      setSelectedBooking(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Welcome Header */}
      <div className="bg-[#1E293B] rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin!</h1>
        <p className="text-gray-300">Here&apos;s what&apos;s happening in your salon today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#3B82F6] rounded-2xl p-4 text-white">
        <p className="text-md font-normal mb-2">Total Bookings</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-bold">{stats.totalBookings}</p>
            <CalendarIcon className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-[#F59E0B] rounded-2xl p-4 text-white">
        <p className="text-md font-normal mb-2">Pending Bookings</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-bold">{stats.pendingBookings}</p>
            <ClockIcon className="h-9 w-9 stroke-2" />
          </div>
        </div>

        <div className="bg-[#059669] rounded-2xl p-4 text-white">
        <p className="text-md font-normal mb-2">Confirmed Bookings</p>

          <div className="flex items-center justify-between">
            <p className="text-4xl font-bold">{stats.confirmedBookings}</p>
            <UserIcon className="h-9 w-9 stroke-2" />
          </div>
        </div>

        <div className="bg-[#DC2626] rounded-2xl p-4 text-white">
          <p className="text-sm font-normal mb-2">Cancelled Bookings</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-bold">{stats.cancelledBookings}</p>
            <ScissorsIcon className="h-8 w-8" />

          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <p className="text-gray-500 text-sm">Manage your upcoming appointments</p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="px-4 py-2 bg-[#1E293B] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            View All
            <span className="text-lg">→</span>
          </Link>
            </div>

        <div className="px-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-4 font-normal">Date</th>
                <th className="pb-4 font-normal">Time</th>
                <th className="pb-4 font-normal">Client</th>
                <th className="pb-4 font-normal">Email</th>
                <th className="pb-4 font-normal">Hairstyle</th>
                <th className="pb-4 font-normal">Status</th>
                <th className="pb-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="text-gray-800">
                  <td className="py-4">{booking.date}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      {booking.time}
                </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-700 font-medium">
                          {booking.userName.charAt(0)}
                        </span>
            </div>
                      {booking.userName}
            </div>
                  </td>
                  <td className="py-4 text-gray-600">{booking.userEmail}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <ScissorsIcon className="h-5 w-5 text-gray-500" />
                      {booking.hairstyle}
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : ""}
                      ${booking.status === "pending" ? "bg-amber-100 text-amber-600" : ""}
                      ${booking.status === "cancelled" ? "bg-rose-100 text-rose-600" : ""}
                    `}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                <button
                      className="text-gray-500 hover:text-gray-700 flex justify-center w-full"
                      onClick={() => setSelectedBooking(booking)}
                      aria-label={`View details for booking by ${booking.userName}`}
                >
                      <EllipsisHorizontalCircleIcon className="h-6 w-6" />
                </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Action Modal */}
      {selectedBooking ? (
        <BookingActionModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onConfirm={selectedBooking.status === "pending" ? handleConfirmBooking : undefined}
          onCancel={selectedBooking.status === "pending" ? handleCancelBooking : undefined}
        />
      ) : null}
    </div>
  );
}