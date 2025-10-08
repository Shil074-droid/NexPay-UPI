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
import { getMerchants, createTransaction } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const selectMerchantSchema = z.object({
  merchantId: z.string({ required_error: 'Please select a merchant.' }),
});

const amountSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be positive.' })
    .min(1, { message: 'Amount must be at least ₹1' }),
});

export function PaymentModal({ isOpen, onOpenChange }: PaymentModalProps) {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [merchants, setMerchants] = useState<User[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getMerchants().then(setMerchants);
    } else {
      // Reset state on close
      setTimeout(() => {
        setStep(1);
        setSelectedMerchant(null);
        selectMerchantForm.reset();
        amountForm.reset();
      }, 300);
    }
  }, [isOpen]);

  const selectMerchantForm = useForm<z.infer<typeof selectMerchantSchema>>({
    resolver: zodResolver(selectMerchantSchema),
  });

  const amountForm = useForm<z.infer<typeof amountSchema>>({
    resolver: zodResolver(amountSchema),
  });

  function onSelectMerchant(values: z.infer<typeof selectMerchantSchema>) {
    const merchant = merchants.find((m) => m.id === values.merchantId);
    if (merchant) {
      setSelectedMerchant(merchant);
      setStep(2);
    }
  }

  async function onSendPayment(values: z.infer<typeof amountSchema>) {
    if (!user || !selectedMerchant) return;

    if (user.balance < values.amount) {
        toast({
            variant: 'destructive',
            title: 'Insufficient Balance',
            description: 'You do not have enough funds to complete this transaction.',
        });
        return;
    }

    setLoading(true);
    const result = await createTransaction(user.id, selectedMerchant.id, values.amount);
    setLoading(false);

    if (result) {
      toast({
        title: 'Payment Successful',
        description: `You sent ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(values.amount)} to ${selectedMerchant.name}.`,
      });
      refetchUser(); // Update balance in UI
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Make a Payment</DialogTitle>
              <DialogDescription>Select a merchant to send money to.</DialogDescription>
            </DialogHeader>
            <Form {...selectMerchantForm}>
              <form onSubmit={selectMerchantForm.handleSubmit(onSelectMerchant)} className="space-y-4 py-4">
                <FormField
                  control={selectMerchantForm.control}
                  name="merchantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a merchant..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {merchants.map((merchant) => (
                            <SelectItem key={merchant.id} value={merchant.id}>
                              {merchant.name}
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
        {step === 2 && selectedMerchant && (
          <>
            <DialogHeader>
              <DialogTitle>Send to {selectedMerchant.name}</DialogTitle>
              <DialogDescription>Enter the amount you want to send.</DialogDescription>
            </DialogHeader>
            <Form {...amountForm}>
              <form onSubmit={amountForm.handleSubmit(onSendPayment)} className="space-y-4 py-4">
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
                    Send Payment
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
