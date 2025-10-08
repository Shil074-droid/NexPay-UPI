import type { User, Transaction } from './types';

let users: User[] = [
  { id: '1', email: 'admin@nexpay.com', password: 'password', role: 'admin', balance: 100000, name: 'Admin User' },
  { id: '2', email: 'customer1@nexpay.com', password: 'password', role: 'customer', balance: 5000, name: 'Alice' },
  { id: '3', email: 'customer2@nexpay.com', password: 'password', role: 'customer', balance: 2500, name: 'Bob' },
  { id: '4', email: 'merchant1@nexpay.com', password: 'password', role: 'merchant', balance: 15000, name: 'Coffee Shop' },
  { id: '5', email: 'merchant2@nexpay.com', password: 'password', role: 'merchant', balance: 75000, name: 'Bookstore' },
];

let transactions: Transaction[] = [
  { id: 't1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), amount: 150, status: 'Completed', settlementMode: 'Instant', fromUserId: '2', fromUserName: 'Alice', toUserId: '4', toUserName: 'Coffee Shop' },
  { id: 't2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), amount: 75, status: 'Completed', settlementMode: 'Instant', fromUserId: '3', fromUserName: 'Bob', toUserId: '5', toUserName: 'Bookstore' },
  { id: 't3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), amount: 1200, status: 'Completed', settlementMode: 'Pending', fromUserId: '2', fromUserName: 'Alice', toUserId: '5', toUserName: 'Bookstore' },
  { id: 't4', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), amount: 25, status: 'Completed', settlementMode: 'Instant', fromUserId: '3', fromUserName: 'Bob', toUserId: '4', toUserName: 'Coffee Shop' },
  { id: 't5', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), amount: 500, status: 'Completed', settlementMode: 'Instant', fromUserId: '2', fromUserName: 'Alice', toUserId: '4', toUserName: 'Coffee Shop' },
];

// Simulate a database delay
const dbDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  await dbDelay(300);
  return users.find(u => u.email === email);
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  await dbDelay(100);
  return users.find(u => u.id === id);
}

export const addUser = async (user: Omit<User, 'id' | 'balance'>): Promise<User> => {
  await dbDelay(500);
  const newUser: User = { 
    ...user, 
    id: String(users.length + 1),
    balance: user.role === 'customer' ? 1000 : 0 // Starting balance
  };
  users.push(newUser);
  return newUser;
};

export const getTransactionsForUser = async (userId: string): Promise<Transaction[]> => {
  await dbDelay(200);
  return transactions
    .filter(t => t.fromUserId === userId || t.toUserId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  await dbDelay(200);
  return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getMerchants = async (): Promise<User[]> => {
  await dbDelay(150);
  return users.filter(u => u.role === 'merchant');
}

export const getCustomers = async (): Promise<User[]> => {
  await dbDelay(150);
  return users.filter(u => u.role === 'customer');
}

export const getAllUsers = async (): Promise<User[]> => {
  await dbDelay(100);
  return users;
}

export const createTransaction = async (fromUserId: string, toUserId: string, amount: number): Promise<Transaction | null> => {
  await dbDelay(700);
  const fromUser = users.find(u => u.id === fromUserId);
  const toUser = users.find(u => u.id === toUserId);

  if (!fromUser || !toUser || fromUser.balance < amount) {
    return null;
  }

  fromUser.balance -= amount;
  toUser.balance += amount;

  const newTransaction: Transaction = {
    id: `t${transactions.length + 1}`,
    date: new Date().toISOString(),
    amount,
    status: 'Completed',
    settlementMode: 'Instant',
    fromUserId,
    fromUserName: fromUser.name,
    toUserId,
    toUserName: toUser.name,
  };
  transactions.unshift(newTransaction);
  return newTransaction;
}
