export type UserRole = 'customer' | 'merchant' | 'admin';

export type User = {
  id: string;
  email: string;
  password?: string; // Should not be sent to client
  role: UserRole;
  balance: number;
  name: string;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  settlementMode: 'Instant' | 'Standard';
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
};
