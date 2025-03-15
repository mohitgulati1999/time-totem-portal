
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from '@/lib/data';
import MembershipForm from './MembershipForm';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';

interface MembershipManagementProps {
  user: User;
  onUpdate?: () => void;
}

const MembershipManagement: React.FC<MembershipManagementProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("membership");

  const handleSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-yellow-600';
      case 'expired':
        return 'text-red-600';
      case 'suspended':
        return 'text-purple-600';
      default:
        return '';
    }
  };

  const getPaymentStatusText = () => {
    if (user.membershipDetails?.feesPaid) {
      return <span className="text-green-600">Paid</span>;
    }
    return <span className="text-red-600">Unpaid</span>;
  };

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="membership">Membership Details</TabsTrigger>
          <TabsTrigger value="payment">Record Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="membership">
            <Card>
              <CardHeader>
                <CardTitle>Configure Membership</CardTitle>
                <CardDescription>
                  Update the user's membership type, status, and dates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Current Membership</h3>
                    <p className="text-lg font-semibold capitalize">{user.membershipType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className={`text-lg font-semibold capitalize ${getMembershipStatusColor(user.status)}`}>
                      {user.status}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                    <p className="text-lg font-semibold">
                      {user.membershipDetails?.startDate ? 
                        new Date(user.membershipDetails.startDate).toLocaleDateString() : 
                        user.memberSince}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                    <p className="text-lg font-semibold">
                      {user.membershipDetails?.endDate ? 
                        new Date(user.membershipDetails.endDate).toLocaleDateString() : 
                        'Not set'}
                    </p>
                  </div>
                </div>
                
                <MembershipForm 
                  userId={user.id} 
                  currentMembership={user.membershipType}
                  currentStatus={user.status}
                  onSuccess={handleSuccess}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Record Payment</CardTitle>
                <CardDescription>
                  Process a payment for this user's membership.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Member</h3>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Membership Type</h3>
                    <p className="text-lg font-semibold capitalize">{user.membershipType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                    <p className="text-lg font-semibold">{getPaymentStatusText()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Payment</h3>
                    <p className="text-lg font-semibold">
                      {user.membershipDetails?.lastPaymentDate ? 
                        new Date(user.membershipDetails.lastPaymentDate).toLocaleDateString() : 
                        'None'}
                    </p>
                  </div>
                </div>
                
                <PaymentForm 
                  userId={user.id} 
                  membershipType={user.membershipType}
                  onSuccess={handleSuccess}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all past payments for this user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentHistory userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MembershipManagement;
