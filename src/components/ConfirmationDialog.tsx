import { useDialog } from "@/stores/dialogStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckIcon, CircleXIcon } from "lucide-react";

type ConfirmationDialogProps = {
  header: string;
  text: React.ReactNode;
  onClose?: () => void;
  onConfirm: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onConfirm,
  text,
  header,
}) => {
  const { isOpen, close } = useDialog();

  return (
    <Dialog open={isOpen("confirmation")} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between">
          <Button onClick={close} variant="secondary">
            <CircleXIcon />
              No
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              Yes
            <CheckIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
