
import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <SidebarProvider>
      <Sidebar className="h-screen border-r">
        <SidebarHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold px-2">Admin Portal</h2>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "dashboard"} 
                onClick={() => onTabChange("dashboard")}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="mr-2" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "attendance"} 
                onClick={() => onTabChange("attendance")}
                tooltip="Attendance"
              >
                <UserCheck className="mr-2" />
                <span>Attendance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "users"} 
                onClick={() => onTabChange("users")}
                tooltip="User Management"
              >
                <Users className="mr-2" />
                <span>User Management</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "membership"} 
                onClick={() => onTabChange("membership")}
                tooltip="Membership & Fees"
              >
                <CreditCard className="mr-2" />
                <span>Membership & Fees</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AdminSidebar;
