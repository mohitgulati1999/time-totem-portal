
import axios from 'axios';
import { User, AttendanceRecord, UsageStats, PaymentRecord } from './data';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User API calls
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const fetchUserByRfid = async (rfidTag: string): Promise<{ user: User; isCheckedIn: boolean }> => {
  const response = await api.get(`/users/rfid/${rfidTag}`);
  return response.data;
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Membership and Fees API calls
export const updateMembership = async (id: string, membershipData: {
  membershipType: string;
  membershipFee: number;
  nextPaymentDue: Date;
  paymentStatus: string;
}): Promise<User> => {
  const response = await api.put(`/users/${id}/membership`, membershipData);
  return response.data;
};

export const recordPayment = async (id: string, paymentData: {
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  extendMonths: number;
}): Promise<{
  user: User;
  payment: {
    amount: number;
    date: string;
    nextPaymentDue: string;
  };
}> => {
  const response = await api.post(`/users/${id}/payment`, paymentData);
  return response.data;
};

export const fetchUsersByPaymentStatus = async (status: 'upcoming' | 'overdue'): Promise<User[]> => {
  const response = await api.get('/users/payments/status', { params: { status } });
  return response.data;
};

// Attendance API calls
export const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  const response = await api.get('/attendance');
  return response.data;
};

export const fetchUserAttendance = async (userId: string): Promise<AttendanceRecord[]> => {
  const response = await api.get(`/attendance/user/${userId}`);
  return response.data;
};

export const checkInUser = async (userId: string): Promise<AttendanceRecord> => {
  const response = await api.post('/attendance/checkin', { userId });
  return response.data;
};

export const checkOutUser = async (userId: string): Promise<AttendanceRecord> => {
  const response = await api.post('/attendance/checkout', { userId });
  return response.data;
};

export const toggleAttendance = async (userId: string): Promise<{
  message: string;
  isCheckIn: boolean;
  attendance: AttendanceRecord;
}> => {
  const response = await api.post('/attendance/toggle', { userId });
  return response.data;
};

// Usage stats
export const fetchUserUsageStats = async (userId: string = 'all'): Promise<UsageStats[]> => {
  const response = await api.get(`/users/stats/${userId}`);
  return response.data;
};

// Auth API calls
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    // Extract user ID from token
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken._id;
    
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export default api;
