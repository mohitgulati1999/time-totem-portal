
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import AttendanceTable from '@/components/AttendanceTable';
import UsageChart from '@/components/UsageChart';
import { 
  getUserAttendanceRecords, 
  generateUserUsageStats, 
  users
} from '@/lib/data';

const MemberDashboard = () => {
  // For demo purposes, we'll use the first user
  const [currentUser] = useState(users[0]);
  
  const userAttendanceRecords = getUserAttendanceRecords(currentUser.id);
  const usageData = generateUserUsageStats(currentUser.id);
  
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Member Dashboard" 
        showBackButton={true}
        userAvatar={currentUser.avatar}
        userName={currentUser.name}
      />
      
      <motion.div 
        className="container py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 page-transition">
            <UserProfile user={currentUser} />
          </TabsContent>
          
          <TabsContent value="usage" className="space-y-6 page-transition">
            <UsageChart 
              data={usageData} 
              title="Your Weekly Usage"
              description="Your facility usage hours for the past week"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">Total Hours</h3>
                <p className="text-3xl font-bold">{currentUser.totalHours}</p>
                <p className="text-sm text-muted-foreground">Hours used this month</p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">Average Daily</h3>
                <p className="text-3xl font-bold">{(currentUser.totalHours / 30).toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Hours per day</p>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">Last Visit</h3>
                <p className="text-3xl font-bold">4.5</p>
                <p className="text-sm text-muted-foreground">Hours on your last visit</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6 page-transition">
            <AttendanceTable records={userAttendanceRecords} showUser={false} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default MemberDashboard;
