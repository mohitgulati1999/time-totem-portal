
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import RFIDScanner from '@/components/RFIDScanner';
import AttendanceTable from '@/components/AttendanceTable';
import UsageChart from '@/components/UsageChart';
import UserManagement from '@/components/UserManagement';
import MembershipManagement from '@/components/membership/MembershipManagement';
import { 
  attendanceRecords, 
  generateUserUsageStats, 
  User,
  users,
  fetchUsers
} from '@/lib/data';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [userScanned, setUserScanned] = useState<{ user: User; isCheckIn: boolean } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setActiveTab("membership");
  };
  
  const handleUserUpdate = () => {
    // Refresh user data after update
    toast.info("User information updated");
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="membership">Membership & Fees</TabsTrigger>
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
            <UserManagement onUserSelect={handleUserSelect} />
          </TabsContent>
          
          <TabsContent value="membership" className="space-y-6 page-transition">
            {selectedUser ? (
              <MembershipManagement user={selectedUser} onUpdate={handleUserUpdate} />
            ) : (
              <div className="text-center py-12 border rounded-md">
                <h3 className="text-lg font-medium mb-2">No User Selected</h3>
                <p className="text-muted-foreground">
                  Please select a user from the User Management tab to configure their membership.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
