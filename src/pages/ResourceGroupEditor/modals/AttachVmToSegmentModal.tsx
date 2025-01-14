import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAttachNicToNetwork } from "@/data/resourceGroup/useAttachNicToNetwork";
import { useResourceGroupNetworks } from "@/data/resourceGroup/useResourceGroupNetworks";
import { useResourceGroupEditorStore } from "@/stores/resourceGroupEditorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPenLineIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type AttachVmToSegmentModalProps = {
  vmId: string;
  nicId: string;
  etag?: string;
};

const attachVmToNetworkSchema = z.object({
  vmId: z.string().min(1),
  networkId: z.string().min(1),
  nicId: z.string().min(1),
});

type AttachVmToNetworkSchema = z.infer<typeof attachVmToNetworkSchema>;

const AttachVmToSegmentModal: React.FC<AttachVmToSegmentModalProps> = ({
  vmId,
  nicId,
  etag,
}) => {
  const { t } = useTranslation();
  const { id } = useResourceGroupEditorStore();
  const { networks } = useResourceGroupNetworks(id ?? "");
  const { attachNicToNetworkAsync, isPending } = useAttachNicToNetwork();
  const form = useForm<AttachVmToNetworkSchema>({
    resolver: zodResolver(attachVmToNetworkSchema),
    defaultValues: {
      vmId: vmId,
      networkId: "",
      nicId: nicId,
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleSubmit = form.handleSubmit(async (data) => {
    await attachNicToNetworkAsync({
      etag: etag ?? "",
      ...data,
    });
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Button>
          <ClipboardPenLineIcon />
          {t("resourceGroupEditor.interfaceList.attach")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("resourceGroupEditor.interfaceList.attachTitle")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="networkId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("resourceGroupEditor.interfaceList.segment")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "resourceGroupEditor.interfaceList.selectPrivateSegment"
                          )}
                        ></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {networks?.map((net) => (
                        <SelectItem
                          key={net.id}
                          value={(net.id ?? "").toString()}
                        >
                          {net.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              loading={isPending}
              type="submit"
              className="self-end"
            >
              {t("save")}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttachVmToSegmentModal;
