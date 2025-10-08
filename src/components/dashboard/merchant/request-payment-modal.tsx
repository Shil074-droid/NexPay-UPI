'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

import type { User } from '@/lib/types';
import { getCustomers, createTransaction } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';

interface RequestPaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const selectCustomerSchema = z.object({
  customerId: z.string({ required_error: 'Please select a customer.' }),
});

const amountSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be positive.' })
    .min(1, { message: 'Amount must be at least ₹1' }),
});

export function RequestPaymentModal({ isOpen, onOpenChange }: RequestPaymentModalProps) {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getCustomers().then(setCustomers);
    } else {
      // Reset state on close
      setTimeout(() => {
        setStep(1);
        setSelectedCustomer(null);
        selectCustomerForm.reset();
        amountForm.reset();
      }, 300);
    }
  }, [isOpen]);

  const selectCustomerForm = useForm<z.infer<typeof selectCustomerSchema>>({
    resolver: zodResolver(selectCustomerSchema),
  });

  const amountForm = useForm<z.infer<typeof amountSchema>>({
    resolver: zodResolver(amountSchema),
  });

  function onSelectCustomer(values: z.infer<typeof selectCustomerSchema>) {
    const customer = customers.find((m) => m.id === values.customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setStep(2);
    }
  }

  async function onSendRequest(values: z.infer<typeof amountSchema>) {
    if (!user || !selectedCustomer) return;

    setLoading(true);
    // In a real app, this would create a 'pending' request.
    // For this mock app, we'll show a success toast.
    await new Promise(resolve => setTimeout(resolve, 700));
    setLoading(false);
    
    toast({
        title: 'Payment Request Sent',
        description: `A request for ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(values.amount)} has been sent to ${selectedCustomer.name}.`,
    });
    onOpenChange(false);

    // Note: The following code would execute a real transaction, but for a request,
    // we are just showing a notification.

    /*
    const customer = await findUserById(selectedCustomer.id);
    if (customer && customer.balance < values.amount) {
        toast({
            variant: 'destructive',
            title: 'Request Failed',
            description: `${customer.name} has insufficient funds.`,
        });
        setLoading(false);
        return;
    }

    const result = await createTransaction(selectedCustomer.id, user.id, values.amount);
    setLoading(false);

    if (result) {
      toast({
        title: 'Payment Received',
        description: `You received ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(values.amount)} from ${selectedCustomer.name}.`,
      });
      refetchUser(); // Update balance in UI
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'There was an error processing the payment. Please try again.',
      });
    }
    */
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Request a Payment</DialogTitle>
              <DialogDescription>Select a customer to request money from.</DialogDescription>
            </DialogHeader>
            <Form {...selectCustomerForm}>
              <form onSubmit={selectCustomerForm.handleSubmit(onSelectCustomer)} className="space-y-4 py-4">
                <FormField
                  control={selectCustomerForm.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Next</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        {step === 2 && selectedCustomer && (
          <>
            <DialogHeader>
              <DialogTitle>Request from {selectedCustomer.name}</DialogTitle>
              <DialogDescription>Enter the amount you want to request.</DialogDescription>
            </DialogHeader>
            <Form {...amountForm}>
              <form onSubmit={amountForm.handleSubmit(onSendRequest)} className="space-y-4 py-4">
                <FormField
                  control={amountForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                            <Input type="number" step="1" placeholder="0.00" className="pl-7" {...field} />
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <DialogFooter>
                  <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Request
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
