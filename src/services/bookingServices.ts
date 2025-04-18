import { mockBookings, mockStats, mockAvailableSlots } from './mockData';

export interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  duration: number;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  userName: string;
  userEmail: string;
}

export const createBooking = async (data: { 
  date: string; 
  time: string; 
  service: string;
  duration: number;
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBooking: Booking = {
    id: (mockBookings.length + 1).toString(),
    date: data.date,
    time: data.time,
    service: data.service,
    duration: data.duration,
    userId: 'mockUserId',
    status: 'pending',
    userName: 'Mock User',
    userEmail: 'mock@example.com'
  };
  mockBookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    mockBookings[bookingIndex].status = status;
  }
  return { success: true };
};

export const getAllBookings = async (filters?: { 
  status?: string;
  date?: string;
  userId?: string;
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredBookings = [...mockBookings];
  
  if (filters) {
    if (filters.status) {
      filteredBookings = filteredBookings.filter(b => b.status === filters.status);
    }
    if (filters.date) {
      filteredBookings = filteredBookings.filter(b => b.date === filters.date);
    }
    if (filters.userId) {
      filteredBookings = filteredBookings.filter(b => b.userId === filters.userId);
    }
  }
  
  return { bookings: filteredBookings };
};

export const getBookingStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStats;
};

export const getAvailableSlots = async (date: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    availableSlots: mockAvailableSlots[date] || []
  };
};

export const setAvailableSlots = async (date: string, slots: string[]) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  mockAvailableSlots[date] = slots;
  return { success: true };
};

export const getAllBookedDates = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const bookedDates = [...new Set(mockBookings.map(b => b.date))];
  return { bookedDates };
};