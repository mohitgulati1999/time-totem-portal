import React from 'react';
import { Edit, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserTableProps {
  users: User[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  showPaymentStatus?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, showPaymentStatus = false }) => {
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
  
  const getPaymentStatusBadgeColor = (status: string, dueDate: string | undefined) => {
    if (!status && dueDate) {
      const due = new Date(dueDate);
      const today = new Date();
      if (due < today) {
        return 'bg-red-100 text-red-800';
      }
    }
    
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const isPaymentOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Membership</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Member Since</th>
            {showPaymentStatus && (
              <>
                <th className="p-3 text-left">Payment Status</th>
                <th className="p-3 text-left">Next Due Date</th>
              </>
            )}
            <th className="p-3 text-left">Total Hours</th>
            <th className="p-3 text-left">RFID Tag</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={showPaymentStatus ? 9 : 7} className="text-center py-8 text-muted-foreground">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
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
                  {user.membershipFee && (
                    <div className="text-xs text-muted-foreground mt-1">
                      ${typeof user.membershipFee === 'number' ? user.membershipFee.toFixed(2) : user.membershipFee}/mo
                    </div>
                  )}
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
                {showPaymentStatus && (
                  <>
                    <td className="p-3 border-b border-muted">
                      <Badge 
                        variant="outline" 
                        className={`${getPaymentStatusBadgeColor(user.paymentStatus || '', user.nextPaymentDue)} border-0`}
                      >
                        {isPaymentOverdue(user.nextPaymentDue) && !user.paymentStatus
                          ? 'Overdue'
                          : (user.paymentStatus || 'Unknown')}
                      </Badge>
                    </td>
                    <td className="p-3 border-b border-muted">
                      {user.nextPaymentDue ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center">
                              {format(new Date(user.nextPaymentDue), 'MMM d, yyyy')}
                              {isPaymentOverdue(user.nextPaymentDue) && (
                                <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {isPaymentOverdue(user.nextPaymentDue)
                                ? 'Payment overdue'
                                : 'Next payment due date'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        'Not set'
                      )}
                    </td>
                  </>
                )}
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
                      <DropdownMenuItem onClick={() => onEdit(user.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(user.id)}
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
  );
};

export default UserTable;
