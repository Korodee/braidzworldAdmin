import { Booking } from './bookingServices';

export const mockBookings: Booking[] = [
  {
    id: '1',
    date: '2024-04-15',
    time: '10:00',
    service: 'Haircut',
    duration: 30,
    userId: 'user1',
    status: 'pending',
    userName: 'John Doe',
    userEmail: 'john@example.com'
  },
  {
    id: '2',
    date: '2024-04-15',
    time: '11:00',
    service: 'Hair Coloring',
    duration: 120,
    userId: 'user2',
    status: 'confirmed',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com'
  },
  {
    id: '3',
    date: '2024-04-16',
    time: '14:00',
    service: 'Styling',
    duration: 45,
    userId: 'user3',
    status: 'cancelled',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com'
  }
];

export const mockStats = {
  totalBookings: 3,
  pendingBookings: 1,
  confirmedBookings: 1,
  cancelledBookings: 1
};

export interface AvailableSlotsMap {
  [date: string]: string[];
}

export const mockAvailableSlots: AvailableSlotsMap = {
  '2024-04-15': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  '2024-04-16': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
}; 