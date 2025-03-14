
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Search, ArrowUpDown, User, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AttendanceRecord, getUserById } from '@/lib/data';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showUser?: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, showUser = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: 'date' | 'name' | 'duration') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.checkIn).getTime();
      const dateB = new Date(b.checkIn).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'name' && showUser) {
      const userA = getUserById(a.userId)?.name || '';
      const userB = getUserById(b.userId)?.name || '';
      return sortOrder === 'asc'
        ? userA.localeCompare(userB)
        : userB.localeCompare(userA);
    } else if (sortBy === 'duration') {
      const durationA = a.duration || 0;
      const durationB = b.duration || 0;
      return sortOrder === 'asc' ? durationA - durationB : durationB - durationA;
    }
    return 0;
  });

  const filteredRecords = sortedRecords.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const user = getUserById(record.userId);
    
    return (
      (user && user.name.toLowerCase().includes(searchLower)) ||
      format(parseISO(record.checkIn), 'MMM dd, yyyy').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="glass-card rounded-xl p-4 transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4">
        <h3 className="text-lg font-medium">Attendance Records</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full sm:w-auto"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {showUser && (
                <th className="p-3 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Name
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </th>
              )}
              <th className="p-3 text-left">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('date')}
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Date & Time
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </th>
              <th className="p-3 text-left">Check In</th>
              <th className="p-3 text-left">Check Out</th>
              <th className="p-3 text-left">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('duration')}
                  className="hover:bg-transparent p-0 h-auto font-medium flex items-center gap-1"
                >
                  Duration
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={showUser ? 5 : 4} className="text-center py-8 text-muted-foreground">
                  No attendance records found
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const user = getUserById(record.userId);
                return (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                    {showUser && (
                      <td className="p-3 border-b border-muted">
                        {user?.name || 'Unknown User'}
                      </td>
                    )}
                    <td className="p-3 border-b border-muted">
                      {format(parseISO(record.checkIn), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-3 border-b border-muted">
                      {format(parseISO(record.checkIn), 'h:mm a')}
                    </td>
                    <td className="p-3 border-b border-muted">
                      {record.checkOut
                        ? format(parseISO(record.checkOut), 'h:mm a')
                        : (
                          <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Active
                          </span>
                        )}
                    </td>
                    <td className="p-3 border-b border-muted">
                      {record.duration !== null
                        ? `${record.duration} ${record.duration === 1 ? 'hour' : 'hours'}`
                        : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
