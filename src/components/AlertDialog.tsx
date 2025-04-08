import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell } from "lucide-react";
import { Cryptocurrency } from "@/services/cryptoApi";
import { addToWatchlist } from "@/services/storageService";
import { toast } from "sonner";

interface AlertDialogProps {
  crypto: Cryptocurrency;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ crypto }) => {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState("above");
  const [purchaseUrl, setPurchaseUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetPrice || isNaN(Number(targetPrice))) {
      toast.error("Please enter a valid target price");
      return;
    }

    try {
      await addToWatchlist({
        cryptoId: crypto.id,
        cryptoName: crypto.name,
        cryptoSymbol: crypto.symbol,
        targetPrice: Number(targetPrice),
        isAbove: condition === "above",
        createdAt: Date.now(),
        purchaseUrl: purchaseUrl || undefined
      });

      toast.success("Price alert created successfully!");
      setOpen(false);
      setTargetPrice("");
      setCondition("above");
      setPurchaseUrl("");
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create price alert");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <Bell className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            Set a price alert for {crypto.name} ({crypto.symbol.toUpperCase()})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Target Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
              />
            </div>
            <div className="grid gap-2">
              <Label>Alert Condition</Label>
              <RadioGroup value={condition} onValueChange={setCondition}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="above" id="above" />
                  <Label htmlFor="above">Price goes above target</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="below" id="below" />
                  <Label htmlFor="below">Price goes below target</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchaseUrl">Purchase URL (Optional)</Label>
              <Input
                id="purchaseUrl"
                type="url"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="Enter URL to purchase"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Alert</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
