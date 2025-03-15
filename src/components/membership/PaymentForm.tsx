
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { membershipFees, paymentMethods } from '@/lib/data';
import { recordPayment } from "@/lib/api";

interface PaymentFormProps {
  userId: string;
  membershipType: string;
  onSuccess?: () => void;
}

const formSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  method: z.string({
    required_error: "Please select a payment method",
  }),
  notes: z.string().optional(),
});

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  userId, 
  membershipType,
  onSuccess 
}) => {
  const suggestedAmount = membershipFees[membershipType as keyof typeof membershipFees] || 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: suggestedAmount,
      method: paymentMethods[0],
      notes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await recordPayment(userId, {
        amount: values.amount,
        method: values.method,
        notes: values.notes,
      });
      
      toast.success("Payment recorded successfully");
      form.reset({
        amount: suggestedAmount,
        method: paymentMethods[0],
        notes: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input {...field} type="number" className="pl-7" />
                </div>
              </FormControl>
              <FormDescription>
                Suggested amount for {membershipType} membership: ${suggestedAmount}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Any additional information about this payment"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Record Payment</Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
