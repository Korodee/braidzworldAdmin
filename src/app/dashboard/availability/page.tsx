"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isToday,
  parseISO,
  isBefore,
} from "date-fns";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiClock,
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { Dialog } from "@headlessui/react";

interface BlockedTime {
  id: string;
  date: string;
  time: string;
  reason: string;
  isFullDay: boolean;
}

interface Notification {
  message: string;
  type: "success" | "error";
}

export default function AvailabilityCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [isFullDay, setIsFullDay] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [timeToDelete, setTimeToDelete] = useState<BlockedTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Generate time slots from 9 AM to 6 PM with 30-minute intervals
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  const startDate = startOfWeek(startOfMonth(currentMonth));

  // Load saved blocked times from localStorage on component mount
  useEffect(() => {
    const savedBlockedTimes = localStorage.getItem("blockedTimes");
    if (savedBlockedTimes) {
      try {
        setBlockedTimes(JSON.parse(savedBlockedTimes));
      } catch (error) {
        console.error("Error parsing saved blocked times:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save blocked times to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("blockedTimes", JSON.stringify(blockedTimes));
    }
  }, [blockedTimes, isLoading]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ message, type });
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey);
    setIsModalOpen(true);
  };

  const isDateBlocked = (dateKey: string) => {
    return blockedTimes.some((blocked) => blocked.date === dateKey);
  };

  const isTimeBlocked = (dateKey: string, time: string) => {
    return blockedTimes.some(
      (blocked) => blocked.date === dateKey && blocked.time === time
    );
  };

  const handleBlockTime = () => {
    if (selectedDate) {
      const newBlockedTime: BlockedTime = {
        id: `${selectedDate}-${isFullDay ? "full-day" : selectedTime}`,
        date: selectedDate,
        time: isFullDay ? "Full Day" : selectedTime,
        reason: reason || "No reason provided",
        isFullDay: isFullDay,
      };

      setBlockedTimes([...blockedTimes, newBlockedTime]);
      setSelectedTime("");
      setReason("");
      setIsFullDay(false);
      setIsModalOpen(false);

      showNotification("Time blocked successfully");
    }
  };

  const openDeleteModal = (blockedTime: BlockedTime) => {
    setTimeToDelete(blockedTime);
    setIsDeleteModalOpen(true);
  };

  const handleRemoveBlockedTime = () => {
    if (timeToDelete) {
      setBlockedTimes(
        blockedTimes.filter((blocked) => blocked.id !== timeToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setTimeToDelete(null);
      showNotification("Blocked time removed");
    }
  };

  const handleSaveAvailability = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      // Here you would save the blocked times to your backend
      console.log("Saving blocked times:", blockedTimes);

      setIsSaving(false);
      showNotification("Availability settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <FiCheck className="mr-2" />
            ) : (
              <FiAlertCircle className="mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      {/* Calendar Section */}
      <div className="bg-white m-4 rounded-2xl shadow-lg overflow-hidden mb-4 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white pointer-events-none"></div>
        
        <div className="p-6 border-b border-gray-100 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
              <p className="text-gray-600 mt-1">
                Select dates to block specific times or entire days
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors text-gray-700"
                  aria-label="Previous month"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-medium px-4 text-gray-900">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors text-gray-700"
                  aria-label="Next month"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSaveAvailability}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Availability
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 relative">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, index) => {
              const date = addDays(startDate, index);
              const dateKey = format(date, "yyyy-MM-dd");
              const isBlocked = isDateBlocked(dateKey);
              const isPast = isBefore(date, new Date());

              return (
                <button
                  key={dateKey}
                  onClick={() => !isPast && handleDateSelect(dateKey)}
                  disabled={isPast}
                  className={`
                    p-3 rounded-lg text-center transition-all relative overflow-hidden
                    ${!isSameMonth(date, currentMonth) ? "text-gray-300" : "text-gray-800"}
                    ${isToday(date) ? "bg-black text-white" : ""}
                    ${isBlocked ? "bg-rose-100 text-rose-700" : "hover:bg-white/80"}
                    ${selectedDate === dateKey ? "ring-2 ring-black" : ""}
                    ${isPast ? "opacity-50 cursor-not-allowed" : ""}
                    shadow-sm
                  `}
                >
                  {format(date, "d")}
                  {isBlocked && (
                    <div className="mt-1 text-xs">
                      <FiAlertCircle className="inline-block w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blocked Times Section */}
      <div className="bg-white m-4 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Blocked Times</h2>
          <p className="text-gray-600 mt-1">
            Manage your blocked dates and times
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : blockedTimes.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">No blocked times yet</p>
              <p className="text-gray-500 text-sm">
                Select a date from the calendar to block specific times
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-800 font-semibold">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-gray-800 font-semibold">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-gray-800 font-semibold">
                      Reason
                    </th>
                    <th className="text-right py-3 px-4 text-gray-800 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blockedTimes
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((blocked) => (
                      <tr
                        key={blocked.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-900">
                          {format(parseISO(blocked.date), "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          <div className="flex items-center gap-2">
                            {blocked.isFullDay ? (
                              <FiCalendar className="w-4 h-4" />
                            ) : (
                              <FiClock className="w-4 h-4" />
                            )}
                            {blocked.time}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {blocked.reason}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => openDeleteModal(blocked)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                            aria-label="Remove blocked time"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Block Time Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl w-full">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Block Time for{" "}
              {selectedDate
                ? format(parseISO(selectedDate), "MMMM d, yyyy")
                : ""}
            </Dialog.Title>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="fullDay"
                  checked={isFullDay}
                  onChange={(e) => setIsFullDay(e.target.checked)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label
                  htmlFor="fullDay"
                  className="text-sm font-medium text-gray-800"
                >
                  Block entire day
                </label>
              </div>

              {!isFullDay && (
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-800 mb-1"
                  >
                    Select Time
                  </label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black text-gray-900"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option
                        key={time}
                        value={time}
                        disabled={isTimeBlocked(selectedDate || "", time)}
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black text-gray-900"
                  placeholder="e.g., Staff training, Holiday"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockTime}
                  disabled={!isFullDay && !selectedTime}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Blocking...</span>
                    </>
                  ) : (
                    "Block Time"
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl w-full">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Delete Blocked Time
            </Dialog.Title>

            <div className="space-y-4">
              <p className="text-gray-800">
                Are you sure you want to delete this blocked time?
              </p>

              {timeToDelete && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {format(parseISO(timeToDelete.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">{timeToDelete.time}</span>
                  </div>
                  {timeToDelete.reason && (
                    <div className="text-gray-700 text-sm">
                      <span className="font-medium">Reason:</span>{" "}
                      {timeToDelete.reason}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveBlockedTime}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
