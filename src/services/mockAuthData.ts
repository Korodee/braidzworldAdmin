export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  rewardPoints: number;
  isEmailVerified: boolean;
}

export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    rewardPoints: 0,
    isEmailVerified: true
  },
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    rewardPoints: 150,
    isEmailVerified: true
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    rewardPoints: 75,
    isEmailVerified: true
  }
];

export const mockTokens = {
  'admin@example.com': 'mock-admin-token',
  'john@example.com': 'mock-user-token-1',
  'jane@example.com': 'mock-user-token-2'
}; 