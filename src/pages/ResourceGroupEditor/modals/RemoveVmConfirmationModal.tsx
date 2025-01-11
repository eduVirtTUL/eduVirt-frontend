import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteResourceGroupVm } from "@/data/resourceGroup/useDeleteResourceGroupVm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

type RemoveVmConfirmationModalProps = {
  vmId: string;
  onConfirm: () => void;
};

const RemoveVmConfirmationModal: React.FC<RemoveVmConfirmationModalProps> = ({
  vmId,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const { deleteVmAsync } = useDeleteResourceGroupVm();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("removeVmModal.confirmation")}</DialogTitle>
          <DialogDescription>
            {t("removeVmModal.confirmationText")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between">
          <DialogClose asChild>
            <Button variant="secondary">{t("no")}</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteVmAsync(vmId);
                onConfirm();
              }}
            >
              {t("yes")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveVmConfirmationModal;
