
import React, { useState, useEffect } from 'react';
import { User, users as mockUsers } from '@/lib/data';
import { toast } from 'sonner';
import SearchBar from './user-management/SearchBar';
import UserTable from './user-management/UserTable';
import DeleteConfirmationDialog from './user-management/DeleteConfirmationDialog';
import UserEditDialog from './user-management/UserEditDialog';
import { updateUser, recordPayment, fetchUsers } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeDollarSign, AlertTriangle } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // In a real application, you would fetch users from the backend
    // For now, we're using mock data
    const loadUsers = async () => {
      try {
        // Uncomment this when backend is ready
        // const fetchedUsers = await fetchUsers();
        // setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      }
    };

    loadUsers();
  }, []);

  const filterUsersByPaymentStatus = () => {
    // Filter users based on active tab
    let filteredUsers = users;
    
    if (activeTab === 'overdue') {
      // Find users with overdue payments
      filteredUsers = users.filter(user => {
        const nextPaymentDate = new Date(user.nextPaymentDue || '');
        const today = new Date();
        return nextPaymentDate < today;
      });
    } else if (activeTab === 'upcoming') {
      // Find users with upcoming payments (within next 7 days)
      filteredUsers = users.filter(user => {
        const nextPaymentDate = new Date(user.nextPaymentDue || '');
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        return nextPaymentDate >= today && nextPaymentDate <= nextWeek;
      });
    }
    
    // Further filter by search term if present
    return filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredUsers = filterUsersByPaymentStatus();

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setConfirmDelete(userId);
  };

  const handleDeleteUser = () => {
    if (confirmDelete) {
      setUsers(users.filter(user => user.id !== confirmDelete));
      toast.success("User deleted successfully");
      setConfirmDelete(null);
    }
  };

  const handleAddUser = () => {
    toast("Add User functionality would be implemented here", {
      description: "This would open a form to add a new user",
    });
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDelete(null);
  };

  const handleSaveUser = (userId: string, userData: any) => {
    // Update user in the state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, ...userData } 
          : user
      )
    );
    
    // Close the dialog
    setEditingUser(null);
    
    // In a real application, you would call the API
    // For example: await updateUser(userId, userData);
  };

  const handleUpdateFees = (userId: string, feeData: any) => {
    // Update user's membership and fee data
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              membershipType: feeData.membershipType,
              membershipFee: feeData.membershipFee,
              nextPaymentDue: feeData.nextPaymentDue.toISOString(),
              paymentStatus: feeData.paymentStatus
            } 
          : user
      )
    );
    
    // In a real application, you would call the API
    // For example: await updateMembership(userId, feeData);
  };

  const handleRecordPayment = (userId: string, paymentData: any) => {
    // Update user's payment status and next due date
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          const nextDueDate = new Date(user.nextPaymentDue || new Date());
          nextDueDate.setMonth(nextDueDate.getMonth() + paymentData.extendMonths);
          
          return { 
            ...user, 
            paymentStatus: 'paid',
            nextPaymentDue: nextDueDate.toISOString()
          };
        }
        return user;
      })
    );
    
    // In a real application, you would call the API
    // For example: await recordPayment(userId, paymentData);
  };

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300">
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddUser={handleAddUser}
      />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Overdue Payments
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <BadgeDollarSign className="h-3 w-3" />
            Upcoming Payments
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab !== 'all' && filteredUsers.length === 0 && (
        <Card className="mb-6">
          <CardContent className="py-4 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No users found with {activeTab === 'overdue' ? 'overdue' : 'upcoming'} payments
            </p>
          </CardContent>
        </Card>
      )}
      
      <UserTable 
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={confirmDeleteUser}
        showPaymentStatus={true}
      />

      <DeleteConfirmationDialog 
        isOpen={!!confirmDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteUser}
      />
      
      <UserEditDialog 
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={handleSaveUser}
        onUpdateFees={handleUpdateFees}
        onRecordPayment={handleRecordPayment}
      />
    </div>
  );
};

export default UserManagement;
