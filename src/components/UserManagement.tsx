
import React, { useState } from 'react';
import { Search, UserPlus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, users as mockUsers } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userId: string) => {
    toast("Edit functionality would be implemented here", {
      description: `Editing user with ID: ${userId}`,
    });
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

  const getMembershipBadgeColor = (type: string) => {
    switch (type) {
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'family':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-medium">User Management</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={handleAddUser} className="btn-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Membership</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Member Since</th>
              <th className="p-3 text-left">Total Hours</th>
              <th className="p-3 text-left">RFID Tag</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 border-b border-muted">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-b border-muted">
                    <Badge 
                      variant="outline" 
                      className={`${getMembershipBadgeColor(user.membershipType)} border-0`}
                    >
                      {user.membershipType}
                    </Badge>
                  </td>
                  <td className="p-3 border-b border-muted">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusBadgeColor(user.status)} border-0`}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-3 border-b border-muted">
                    {new Date(user.memberSince).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b border-muted">
                    {user.totalHours} hours
                  </td>
                  <td className="p-3 border-b border-muted">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                      {user.rfidTag}
                    </code>
                  </td>
                  <td className="p-3 border-b border-muted">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => confirmDeleteUser(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
