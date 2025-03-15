// Mock data for the RFID attendance management system

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membershipType: 'basic' | 'premium' | 'family';
  membershipFee?: number;
  memberSince: string;
  nextPaymentDue?: string;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  totalHours: number;
  status: 'active' | 'inactive';
  rfidTag: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  checkIn: string;
  checkOut: string | null;
  duration: number | null;
}

export interface UsageStats {
  day: string;
  hours: number;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  extendedUntil: string;
}

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=0D8ABC&color=fff',
    membershipType: 'premium',
    membershipFee: 99.99,
    memberSince: '2023-01-15',
    nextPaymentDue: '2023-06-15',
    paymentStatus: 'paid',
    totalHours: 87,
    status: 'active',
    rfidTag: 'A1B2C3D4'
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=FF5733&color=fff',
    membershipType: 'basic',
    membershipFee: 49.99,
    memberSince: '2023-02-20',
    nextPaymentDue: '2023-06-01',
    paymentStatus: 'overdue',
    totalHours: 45,
    status: 'active',
    rfidTag: 'E5F6G7H8'
  },
  {
    id: '3',
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sophia+Chen&background=27AE60&color=fff',
    membershipType: 'family',
    membershipFee: 149.99,
    memberSince: '2023-03-10',
    nextPaymentDue: '2023-06-10',
    paymentStatus: 'pending',
    totalHours: 120,
    status: 'active',
    rfidTag: 'I9J0K1L2'
  },
  {
    id: '4',
    name: 'Miguel Rodriguez',
    email: 'miguel@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Miguel+Rodriguez&background=8E44AD&color=fff',
    membershipType: 'premium',
    membershipFee: 99.99,
    memberSince: '2023-01-05',
    nextPaymentDue: '2023-06-05',
    paymentStatus: 'paid',
    totalHours: 92,
    status: 'active',
    rfidTag: 'M3N4O5P6'
  },
  {
    id: '5',
    name: 'Olivia Johnson',
    email: 'olivia@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Olivia+Johnson&background=F39C12&color=fff',
    membershipType: 'basic',
    membershipFee: 49.99,
    memberSince: '2023-04-18',
    nextPaymentDue: '2023-06-18',
    paymentStatus: 'paid',
    totalHours: 30,
    status: 'inactive',
    rfidTag: 'Q7R8S9T0'
  }
];

// Mock Attendance Records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: '101',
    userId: '1',
    checkIn: '2023-05-01T08:30:00',
    checkOut: '2023-05-01T12:30:00',
    duration: 4
  },
  {
    id: '102',
    userId: '1',
    checkIn: '2023-05-02T09:15:00',
    checkOut: '2023-05-02T14:30:00',
    duration: 5.25
  },
  {
    id: '103',
    userId: '2',
    checkIn: '2023-05-01T10:00:00',
    checkOut: '2023-05-01T15:00:00',
    duration: 5
  },
  {
    id: '104',
    userId: '3',
    checkIn: '2023-05-02T08:00:00',
    checkOut: '2023-05-02T16:00:00',
    duration: 8
  },
  {
    id: '105',
    userId: '4',
    checkIn: '2023-05-01T13:00:00',
    checkOut: '2023-05-01T18:00:00',
    duration: 5
  },
  {
    id: '106',
    userId: '1',
    checkIn: '2023-05-03T08:45:00',
    checkOut: '2023-05-03T12:45:00',
    duration: 4
  },
  {
    id: '107',
    userId: '2',
    checkIn: '2023-05-03T09:30:00',
    checkOut: '2023-05-03T14:30:00',
    duration: 5
  },
  {
    id: '108',
    userId: '3',
    checkIn: '2023-05-03T10:15:00',
    checkOut: null,
    duration: null
  }
];

// Mock payment records
export const paymentRecords: PaymentRecord[] = [
  {
    id: 'pay1',
    userId: '1',
    amount: 99.99,
    paymentDate: '2023-05-15',
    paymentMethod: 'card',
    extendedUntil: '2023-06-15'
  },
  {
    id: 'pay2',
    userId: '2',
    amount: 49.99,
    paymentDate: '2023-05-01',
    paymentMethod: 'bank',
    extendedUntil: '2023-06-01'
  },
  {
    id: 'pay3',
    userId: '3',
    amount: 149.99,
    paymentDate: '2023-05-10',
    paymentMethod: 'card',
    extendedUntil: '2023-06-10'
  },
  {
    id: 'pay4',
    userId: '4',
    amount: 99.99,
    paymentDate: '2023-05-05',
    paymentMethod: 'cash',
    extendedUntil: '2023-06-05'
  },
  {
    id: 'pay5',
    userId: '5',
    amount: 49.99,
    paymentDate: '2023-05-18',
    paymentMethod: 'bank',
    extendedUntil: '2023-06-18'
  }
];

// Mock Usage Stats for Charts
export const generateUserUsageStats = (userId: string): UsageStats[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    hours: Math.floor(Math.random() * 8) + 1
  }));
};

// Function to get today's date in readable format
export const getTodayDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Function to simulate RFID tag scan
export const scanRFIDTag = (tag: string): User | null => {
  return users.find(user => user.rfidTag === tag) || null;
};

// Function to check if a user is currently checked in
export const isUserCheckedIn = (userId: string): boolean => {
  return attendanceRecords.some(record => record.userId === userId && record.checkOut === null);
};

// Function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Function to get attendance records for a user
export const getUserAttendanceRecords = (userId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.userId === userId);
};

// Function to calculate total hours for a user
export const calculateTotalHours = (userId: string): number => {
  return attendanceRecords
    .filter(record => record.userId === userId && record.duration !== null)
    .reduce((total, record) => total + (record.duration || 0), 0);
};

// Function to get payment records for a user
export const getUserPaymentRecords = (userId: string): PaymentRecord[] => {
  return paymentRecords.filter(record => record.userId === userId);
};

// Function to get users with overdue payments
export const getUsersWithOverduePayments = (): User[] => {
  const today = new Date();
  return users.filter(user => {
    if (!user.nextPaymentDue) return false;
    const dueDate = new Date(user.nextPaymentDue);
    return dueDate < today && user.paymentStatus !== 'paid';
  });
};

// Function to get users with upcoming payments (within next 7 days)
export const getUsersWithUpcomingPayments = (): User[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  return users.filter(user => {
    if (!user.nextPaymentDue) return false;
    const dueDate = new Date(user.nextPaymentDue);
    return dueDate >= today && dueDate <= nextWeek;
  });
};
