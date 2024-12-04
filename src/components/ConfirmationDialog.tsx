import { useDialog } from "@/stores/dialogStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

type ConfirmationDialogProps = {
  onClose?: () => void;
  onConfirm: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onConfirm,
}) => {
  const { isOpen, close } = useDialog();

  return (
    <Dialog open={isOpen("confirmation")} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
        </DialogHeader>
        <div>
          <Button
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            Yes
          </Button>
          <Button onClick={close}>No</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
