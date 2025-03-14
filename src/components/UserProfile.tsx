
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Calendar, Clock, Zap } from 'lucide-react';
import { User, calculateTotalHours } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const memberSinceDate = new Date(user.memberSince).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const totalHours = calculateTotalHours(user.id);
  
  const getMembershipDetails = (type: string) => {
    switch (type) {
      case 'basic':
        return {
          name: 'Basic',
          color: 'bg-gray-100 text-gray-800',
          description: 'Access during standard hours, limited to 30 hours per month'
        };
      case 'premium':
        return {
          name: 'Premium',
          color: 'bg-blue-100 text-blue-800',
          description: 'Extended access hours, unlimited usage and priority booking'
        };
      case 'family':
        return {
          name: 'Family',
          color: 'bg-purple-100 text-purple-800',
          description: 'Full access for up to 4 family members with shared benefits'
        };
      default:
        return {
          name: type,
          color: 'bg-gray-100 text-gray-800',
          description: 'Standard membership'
        };
    }
  };
  
  const membership = getMembershipDetails(user.membershipType);
  
  const handleEdit = () => {
    setIsEditing(true);
    toast.info("Profile editing would be implemented here");
    setTimeout(() => setIsEditing(false), 2000);
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="glass-card border border-muted shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-4">
              <Avatar className="h-16 w-16 mb-3 sm:mb-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
                <div className="mt-2">
                  <Badge variant="outline" className={`${membership.color} border-0`}>
                    {membership.name} Membership
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={user.status === 'active' 
                      ? 'bg-green-100 text-green-800 ml-2 border-0' 
                      : 'bg-red-100 text-red-800 ml-2 border-0'
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleEdit}
              disabled={isEditing}
              className="mt-1"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">{memberSinceDate}</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Clock className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="font-medium">{totalHours} hours</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Zap className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">RFID Tag</p>
              <code className="bg-background px-2 py-1 rounded font-mono text-sm mt-1">
                {user.rfidTag}
              </code>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Membership Benefits</h4>
            <p className="text-sm text-muted-foreground">{membership.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 mt-2">
          <Button variant="outline">View Attendance History</Button>
          <Button>Manage Membership</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
