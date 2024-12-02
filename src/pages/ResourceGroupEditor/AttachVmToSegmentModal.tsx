import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAttachVmToNetwork } from "@/data/resourceGroup/useAttachVmToNetwork";
import { useResourceGroupNetworks } from "@/data/resourceGroup/useResourceGroupNetworks";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AttachVmToSegmentModalProps = {
  id: string;
  vmId: string;
};

const attachVmToNetworkSchema = z.object({
  vmId: z.string().min(1),
  networkId: z.string().min(1),
});

type AttachVmToNetworkSchema = z.infer<typeof attachVmToNetworkSchema>;

const AttachVmToSegmentModal: React.FC<AttachVmToSegmentModalProps> = ({
  id,
  vmId,
}) => {
  const { networks } = useResourceGroupNetworks(id);
  const { attachVmToNetwork } = useAttachVmToNetwork();
  const form = useForm<AttachVmToNetworkSchema>({
    resolver: zodResolver(attachVmToNetworkSchema),
    defaultValues: {
      vmId: vmId,
      networkId: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    attachVmToNetwork(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add vm to segment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach vm to network</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="networkId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Course</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? networks?.find((c) => c.id === field.value)?.name
                            : "Select Course"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search courses..." />
                        <CommandList>
                          <CommandEmpty>No courses found</CommandEmpty>
                          <CommandGroup>
                            {networks?.map((c) => (
                              <CommandItem
                                value={c.name}
                                key={c.id}
                                onSelect={() => {
                                  form.setValue("networkId", c.id ?? "");
                                }}
                              >
                                {c.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    c.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttachVmToSegmentModal;
