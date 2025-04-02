import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PriceAlert, saveAlert } from "@/services/alertService";
import { Cryptocurrency } from "@/services/cryptoApi";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatters";

interface AlertDialogProps {
  crypto: Cryptocurrency;
}

interface AlertFormValues {
  targetPrice: string;
  direction: "above" | "below";
  purchaseUrl: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ crypto }) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<AlertFormValues>({
    defaultValues: {
      targetPrice: crypto.current_price.toString(),
      direction: "above",
      purchaseUrl: "",
    },
  });

  const onSubmit = async (data: AlertFormValues) => {
    try {
      const targetPrice = parseFloat(data.targetPrice);
      
      if (isNaN(targetPrice)) {
        toast.error("Please enter a valid price");
        return;
      }
      
      const alert: PriceAlert = {
        id: crypto.id + "_" + Date.now(),
        cryptoId: crypto.id,
        cryptoName: crypto.name,
        cryptoSymbol: crypto.symbol,
        targetPrice,
        isAbove: data.direction === "above",
        createdAt: Date.now(),
        purchaseUrl: data.purchaseUrl || undefined,
      };
      
      await saveAlert(alert);
      
      toast.success(`Price alert set for ${crypto.name}`, {
        description: `You'll be notified when the price goes ${data.direction} ${formatPrice(targetPrice)}`,
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error saving alert:', error);
      toast.error("Failed to save alert");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert for {crypto.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="targetPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Price (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.0001" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Alert me when price goes:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="above" id="above" />
                        <label htmlFor="above">Above target</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="below" id="below" />
                        <label htmlFor="below">Below target</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purchaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase URL (optional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Alert</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
