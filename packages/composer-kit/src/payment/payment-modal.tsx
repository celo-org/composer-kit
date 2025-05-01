import { Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../core/dialog";
import { cn } from "../utils/helper";
import { buttonVariants } from "../utils/theme";
import { usePayment } from "./payment";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function PaymentDialog({
  open,
  onOpenChange,
}: PaymentDialogProps): JSX.Element {
  const { amount, recipientAddress, isLoading, handlePayment } = usePayment();

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Please review the payment details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Amount</p>
            <p className="mt-1">{amount} cUSD</p>
          </div>

          <div>
            <p className="text-sm font-medium">Recipient</p>
            <p className="mt-1 break-all">{recipientAddress}</p>
          </div>

          <div
            className="border border-gray-200 rounded-lg p-4"
          >
            <QRCode
              size={356}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={recipientAddress}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>

        <DialogFooter>
          <button
            className={cn(
              buttonVariants({
                variant: "outline",
              })
            )}
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className={cn(buttonVariants({}))}
            disabled={isLoading}
            onClick={handlePayment}
            type="button"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            Confirm Payment
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
