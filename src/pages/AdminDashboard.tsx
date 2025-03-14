
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import RFIDScanner from '@/components/RFIDScanner';
import AttendanceTable from '@/components/AttendanceTable';
import UsageChart from '@/components/UsageChart';
import UserManagement from '@/components/UserManagement';
import { 
  attendanceRecords, 
  generateUserUsageStats, 
  User,
  users
} from '@/lib/data';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [userScanned, setUserScanned] = useState<{ user: User; isCheckIn: boolean } | null>(null);
  
  const handleUserScanned = (user: User, isCheckIn: boolean) => {
    setUserScanned({ user, isCheckIn });
    
    // In a real application, this would update the database
    // For demo purposes, we'll just show a toast
    toast.success(
      isCheckIn 
        ? `${user.name} checked in successfully` 
        : `${user.name} checked out successfully`
    );
  };
  
  // For the usage chart, we'll use combined data from all users
  const usageData = generateUserUsageStats('all');
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Admin Dashboard" 
        showBackButton={true}
        userAvatar="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
        userName="Admin"
      />
      
      <motion.div 
        className="container py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 page-transition">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <RFIDScanner onUserScanned={handleUserScanned} />
              </div>
              <div className="md:col-span-2">
                <UsageChart 
                  data={usageData} 
                  title="Weekly Facility Usage"
                  description="Total hours of facility usage per day"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <AttendanceTable 
                records={attendanceRecords.slice(0, 5)} 
                showUser={true} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6 page-transition">
            <AttendanceTable records={attendanceRecords} showUser={true} />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6 page-transition">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
