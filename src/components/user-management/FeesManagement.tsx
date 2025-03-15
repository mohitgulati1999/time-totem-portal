
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar as CalendarIcon, BadgeDollarSign, Receipt, CreditCard } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { User } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const membershipOptions = [
  { value: 'basic', label: 'Basic', price: 49.99 },
  { value: 'premium', label: 'Premium', price: 99.99 },
  { value: 'family', label: 'Family', price: 149.99 },
];

const FormSchema = z.object({
  membershipType: z.string({
    required_error: "Please select a membership type",
  }),
  membershipFee: z.coerce.number().min(0, {
    message: "Fee must be a positive number",
  }),
  nextPaymentDue: z.date({
    required_error: "A payment due date is required",
  }),
  paymentStatus: z.string({
    required_error: "Please select a payment status",
  }),
});

const PaymentFormSchema = z.object({
  amount: z.coerce.number().min(0.01, {
    message: "Payment amount must be at least 0.01",
  }),
  paymentMethod: z.string({
    required_error: "Please select a payment method",
  }),
  paymentDate: z.date({
    required_error: "Payment date is required",
  }),
  extendMonths: z.coerce.number().min(1, {
    message: "Must extend by at least 1 month",
  }).max(12, {
    message: "Cannot extend by more than 12 months at once",
  }),
});

interface FeesManagementProps {
  user: User;
  onUpdateFees: (userId: string, data: any) => void;
  onRecordPayment: (userId: string, data: any) => void;
}

const FeesManagement: React.FC<FeesManagementProps> = ({ 
  user, 
  onUpdateFees, 
  onRecordPayment 
}) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  // Membership & Fee Management Form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      membershipType: user.membershipType,
      membershipFee: typeof user.membershipFee === 'number' ? user.membershipFee : 
        membershipOptions.find(option => option.value === user.membershipType)?.price || 49.99,
      nextPaymentDue: user.nextPaymentDue ? new Date(user.nextPaymentDue) : new Date(),
      paymentStatus: user.paymentStatus || 'paid',
    },
  });

  // Payment Recording Form
  const paymentForm = useForm<z.infer<typeof PaymentFormSchema>>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      amount: typeof user.membershipFee === 'number' ? user.membershipFee : 
        membershipOptions.find(option => option.value === user.membershipType)?.price || 49.99,
      paymentMethod: "card",
      paymentDate: new Date(),
      extendMonths: 1,
    },
  });

  const handleMembershipTypeChange = (value: string) => {
    const selectedMembership = membershipOptions.find(option => option.value === value);
    if (selectedMembership) {
      form.setValue("membershipFee", selectedMembership.price);
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onUpdateFees(user.id, data);
    toast.success("Membership and fees updated successfully");
  };

  const onSubmitPayment = (data: z.infer<typeof PaymentFormSchema>) => {
    onRecordPayment(user.id, data);
    setPaymentDialogOpen(false);
    toast.success(`Payment of $${data.amount.toFixed(2)} recorded successfully`);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5" />
            Membership & Fees
          </CardTitle>
          <CardDescription>
            Manage this user's membership type, fees, and payment schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Current Membership</div>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getMembershipBadgeColor(user.membershipType)}`}>
                {user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)}
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Current Fee</div>
              <div className="font-medium">
                ${typeof user.membershipFee === 'number' ? user.membershipFee.toFixed(2) : 
                  (membershipOptions.find(option => option.value === user.membershipType)?.price || 49.99).toFixed(2)}
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center justify-center">
              <div className="text-sm text-muted-foreground mb-1">Payment Status</div>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.paymentStatus || 'paid')}`}>
                {(user.paymentStatus || 'Paid').charAt(0).toUpperCase() + (user.paymentStatus || 'paid').slice(1)}
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="membershipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Type</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleMembershipTypeChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select membership type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {membershipOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label} (${option.price.toFixed(2)}/month)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Fee</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            className="pl-7" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Monthly fee amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nextPaymentDue"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Payment Due</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Update Membership & Fees</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t">
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Receipt className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Record a payment for {user.name}'s membership
                </DialogDescription>
              </DialogHeader>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0.01" 
                              className="pl-7" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentForm.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Payment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentForm.control}
                    name="extendMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extend Membership (months)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="12" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of months to extend membership
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeesManagement;
