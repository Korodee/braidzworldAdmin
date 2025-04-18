import { format } from "date-fns";
import { Booking } from "@/services/bookingServices";

export const SERVICES = [
  "Haircut",
  "Coloring",
  "Styling",
  "Treatment",
  "Manicure",
  "Pedicure",
  "Facial",
  "Massage"
] as const;

export const STATUSES = ["pending", "confirmed", "cancelled"] as const;

export const CLIENTS = [
  { name: "John Smith", email: "john.smith@example.com" },
  { name: "Emma Johnson", email: "emma.j@example.com" },
  { name: "Michael Brown", email: "michael.b@example.com" },
  { name: "Sarah Davis", email: "sarah.d@example.com" },
  { name: "David Wilson", email: "david.w@example.com" },
  { name: "Lisa Anderson", email: "lisa.a@example.com" },
  { name: "Robert Taylor", email: "robert.t@example.com" },
  { name: "Jennifer Martinez", email: "jennifer.m@example.com" },
  { name: "William Thomas", email: "william.t@example.com" },
  { name: "Patricia Garcia", email: "patricia.g@example.com" },
  { name: "James Wilson", email: "james.w@example.com" },
  { name: "Elizabeth Moore", email: "elizabeth.m@example.com" },
  { name: "Joseph Lee", email: "joseph.l@example.com" },
  { name: "Margaret White", email: "margaret.w@example.com" },
  { name: "Thomas Harris", email: "thomas.h@example.com" },
  { name: "Susan Clark", email: "susan.c@example.com" },
  { name: "Charles Lewis", email: "charles.l@example.com" },
  { name: "Jessica Hall", email: "jessica.h@example.com" },
  { name: "Daniel Young", email: "daniel.y@example.com" },
  { name: "Sarah King", email: "sarah.k@example.com" },
  { name: "Matthew Wright", email: "matthew.w@example.com" },
  { name: "Nancy Scott", email: "nancy.s@example.com" },
  { name: "Anthony Green", email: "anthony.g@example.com" },
  { name: "Betty Adams", email: "betty.a@example.com" },
  { name: "Donald Baker", email: "donald.b@example.com" },
  { name: "Dorothy Nelson", email: "dorothy.n@example.com" },
  { name: "Paul Carter", email: "paul.c@example.com" },
  { name: "Karen Mitchell", email: "karen.m@example.com" },
  { name: "Mark Perez", email: "mark.p@example.com" },
  { name: "Helen Roberts", email: "helen.r@example.com" },
  { name: "Steven Turner", email: "steven.t@example.com" },
  { name: "Deborah Phillips", email: "deborah.p@example.com" },
  { name: "Andrew Campbell", email: "andrew.c@example.com" },
  { name: "Sharon Parker", email: "sharon.p@example.com" },
  { name: "Kenneth Evans", email: "kenneth.e@example.com" },
  { name: "Michelle Edwards", email: "michelle.e@example.com" },
  { name: "Joshua Collins", email: "joshua.c@example.com" },
  { name: "Laura Stewart", email: "laura.s@example.com" },
  { name: "Kevin Morris", email: "kevin.m@example.com" },
  { name: "Sandra Rogers", email: "sandra.r@example.com" }
];

export const generateMockBookings = (count: number): Booking[] => {
  const bookings: Booking[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Generate random date within the next 3 months
    const daysToAdd = Math.floor(Math.random() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() + daysToAdd);
    
    // Generate random time between 9 AM and 6 PM
    const hour = Math.floor(Math.random() * 9) + 9;
    const minute = Math.random() > 0.5 ? "00" : "30";
    const time = `${hour.toString().padStart(2, '0')}:${minute}`;
    
    // Get client from the fixed list
    const client = CLIENTS[i % CLIENTS.length];
    
    bookings.push({
      id: `booking-${i + 1}`,
      date: format(date, 'yyyy-MM-dd'),
      time,
      userName: client.name,
      userEmail: client.email,
      service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)] as "pending" | "confirmed" | "cancelled",
      duration: Math.floor(Math.random() * 3) + 1, // Random duration between 1-3 hours
      userId: `user-${i + 1}`
    });
  }
  
  return bookings;
}; 