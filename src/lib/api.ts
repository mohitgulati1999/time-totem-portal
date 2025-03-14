
import axios from 'axios';
import { User, AttendanceRecord, UsageStats } from './data';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export default api;
