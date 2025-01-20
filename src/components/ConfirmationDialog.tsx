import { DialogType, useDialog } from "@/stores/dialogStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckIcon, CircleXIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type ConfirmationDialogProps = {
  name?: DialogType;
  header: string;
  text: React.ReactNode;
  onClose?: () => void;
  onConfirm: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  onConfirm,
  text,
  header,
  name = "confirmation",
}) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();

  return (
    <Dialog open={isOpen(name)} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between">
          <Button onClick={close} variant="secondary" autoFocus={isOpen(name)}>
            <CircleXIcon />
            {t("no")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            {t("yes")}
            <CheckIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
