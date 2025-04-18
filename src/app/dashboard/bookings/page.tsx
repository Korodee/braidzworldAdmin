"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  parseISO,
  isToday,
  isThisWeek,
  isThisMonth,
  isBefore,
} from "date-fns";
import {
  FiCalendar,
  FiClock,
  FiPhone,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { generateMockBookings } from "@/data/mockData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Booking, updateBookingStatus } from "@/services/bookingServices";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "upcoming">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "name" | "service">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
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

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, generate a larger dataset
      const generatedBookings = generateMockBookings(50);
      setBookings(generatedBookings);
      setFilteredBookings(generatedBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Apply filters without API call
  const applyFilters = useCallback(() => {
    let result = [...bookings];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      result = result.filter(booking => {
        const bookingDate = new Date(booking.date);
        switch (dateFilter) {
          case "today":
            return isToday(bookingDate);
          case "week":
            return isThisWeek(bookingDate);
          case "month":
            return isThisMonth(bookingDate);
          case "upcoming":
            return isBefore(today, bookingDate);
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "name":
          comparison = a.userName.localeCompare(b.userName);
          break;
        case "service":
          comparison = a.service.localeCompare(b.service);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    setFilteredBookings(result);
  }, [bookings, statusFilter, dateFilter, sortBy, sortOrder]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search with debounced term
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.trim() === '') {
        // If search is empty, just apply filters without API call
        applyFilters();
        return;
      }

      setIsSearching(true);
      
      try {
        // In a real app, this would be an API call
        // For demo, we'll simulate an API call with a delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simulate API response filtering
        const searchResults = bookings.filter(booking => 
          booking.userName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          booking.service.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          booking.userEmail.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          booking.date.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          booking.time.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          booking.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        
        setFilteredBookings(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm, bookings, applyFilters]);

  // Apply filters and search
  useEffect(() => {
    if (debouncedSearchTerm === '') {
      applyFilters();
    }
  }, [debouncedSearchTerm, applyFilters]);

  // Set initial sort to date descending (most recent first)
  useEffect(() => {
    setSortBy("date");
    setSortOrder("desc");
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  const handleStatusChange = async (bookingId: string, newStatus: "confirmed" | "cancelled") => {
    try {
      // Update the booking status in the backend
      await updateBookingStatus(bookingId, newStatus);

      // Update the local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Update filtered bookings
      setFilteredBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Close the modal
      setSelectedBooking(null);
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const openActionModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsActionModalOpen(true);
  };

  const toggleSort = (field: "date" | "name" | "service") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSortBy("date");
    setSortOrder("asc");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderBookingDetails = (booking: Booking) => (
    <div className="space-y-4 pb-4">
      <div className="flex items-center space-x-2">
        <FiCalendar className="text-gray-500" />
        <span className="text-gray-700">
          {format(parseISO(booking.date), "MMMM d, yyyy")}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <FiClock className="text-gray-500" />
        <span className="text-gray-700">{booking.time}</span>
      </div>
      <div className="flex items-center space-x-2">
        <FiPhone className="text-gray-500" />
        <span className="text-gray-700">{booking.userEmail}</span>
      </div>
      <div className="flex items-center space-x-2">
        <FiMessageSquare className="text-gray-500" />
        <span className="text-gray-700">{booking.service}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Status:</span>
        <span
          className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, service, email, date or time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-800 placeholder-gray-400"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiFilter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          
          {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiX className="h-5 w-5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>
              <p className="text-gray-500 mt-1">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleSort("date")}
                  className={`px-3 py-1 text-sm ${sortBy === "date" ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Date
                </button>
                <button
                  onClick={() => toggleSort("name")}
                  className={`px-3 py-1 text-sm ${sortBy === "name" ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Name
                </button>
                <button
                  onClick={() => toggleSort("service")}
                  className={`px-3 py-1 text-sm ${sortBy === "service" ? "bg-black text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Service
                </button>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-1 rounded-lg hover:bg-gray-100"
                title={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Time</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Client</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Service</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No bookings found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {format(parseISO(booking.date), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700 font-medium">
                            {booking.userName.charAt(0)}
                          </div>
                          <span className="text-gray-800 font-medium">{booking.userName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="text-md">
                          <div className="text-gray-500">{booking.userEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-gray-400" />
                          {booking.service}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <button
                            onClick={() => openActionModal(booking)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Booking actions"
                          >
                            <FiMessageSquare className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Previous
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      <Dialog
        open={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl w-full">
            {selectedBooking && (
              <>
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                  Booking Details
                </Dialog.Title>
                
                {renderBookingDetails(selectedBooking)}
                
                <div className="space-y-3">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <FiCheck className="w-5 h-5" />
                        Confirm Booking
                      </button>
                      
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                        Cancel Booking
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setIsActionModalOpen(false)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Filter Modal */}
      <Dialog
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl w-full">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Filter Bookings
            </Dialog.Title>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      statusFilter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      statusFilter === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setStatusFilter("confirmed")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      statusFilter === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setStatusFilter("cancelled")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      statusFilter === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDateFilter("all")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dateFilter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Dates
                  </button>
                  <button
                    onClick={() => setDateFilter("today")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dateFilter === "today" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setDateFilter("week")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dateFilter === "week" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setDateFilter("month")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dateFilter === "month" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setDateFilter("upcoming")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dateFilter === "upcoming" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Upcoming
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 