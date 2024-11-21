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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAddResourceGroupVm } from "@/data/resourceGroup/useAddResourceGroupVm";
import { useVms } from "@/data/resources/useVms";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AddVmProps = {
  id: string;
};

const addVmSchema = z.object({
  id: z.string().min(1),
});

type AddVmSchema = z.infer<typeof addVmSchema>;

const AddVmModal: React.FC<AddVmProps> = ({ id }) => {
  const { addVm } = useAddResourceGroupVm(id);
  const { vms } = useVms();
  const form = useForm<AddVmSchema>({
    resolver: zodResolver(addVmSchema),
    defaultValues: {
      id: "",
    },
  });

  const handleSubmit = form.handleSubmit((value) => {
    addVm(value);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Virtual Machine</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add Virtual Machine to Resource Group</DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual machine</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? vms?.find((vm) => vm.id === field.value)?.name
                            : "Select Vm"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search vms..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {vms?.map((vm) => (
                              <CommandItem
                                value={vm.name}
                                key={vm.id}
                                onSelect={() => {
                                  form.setValue("id", vm.id ?? "");
                                }}
                              >
                                {vm.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    vm.id === field.value
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
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">Add</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVmModal;
