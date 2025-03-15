
import React, { useState } from 'react';
import { User, users as mockUsers } from '@/lib/data';
import { toast } from 'sonner';
import SearchBar from './user-management/SearchBar';
import UserTable from './user-management/UserTable';
import DeleteConfirmationDialog from './user-management/DeleteConfirmationDialog';

interface UserManagementProps {
  onUserSelect?: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userId: string) => {
    const user = users.find(user => user.id === userId);
    if (user && onUserSelect) {
      onUserSelect(user);
    } else {
      toast("Edit functionality would be implemented here", {
        description: `Editing user with ID: ${userId}`,
      });
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

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300">
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddUser={handleAddUser}
      />
      
      <UserTable 
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={confirmDeleteUser}
      />

      <DeleteConfirmationDialog 
        isOpen={!!confirmDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
