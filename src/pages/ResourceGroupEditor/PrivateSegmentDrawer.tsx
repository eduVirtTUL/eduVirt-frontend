import { ResourceGroupNetworkDto } from "@/api";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAddResourceGroupNetwork } from "@/data/resourceGroup/useAddResourceGroupNetwork";
import { useDeleteResourceGroupNetwork } from "@/data/resourceGroup/useDeleteResourceGroupNetwork";
import { useResourceGroupNetworks } from "@/data/resourceGroup/useResourceGroupNetworks";
import { useDialog } from "@/stores/dialogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PrivateSegmentDrawerProps = {
  id: string;
};

const columns = (
  initDelete: (id: string) => void
): ColumnDef<ResourceGroupNetworkDto>[] => [
  { accessorKey: "name", header: "Name" },
  { id: "nics", accessorFn: () => 0, header: "NICs" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const network = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                initDelete(network.id!);
              }}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const createSegmentSchema = z.object({
  name: z.string().min(1),
});

type CreateSegmentSchema = z.infer<typeof createSegmentSchema>;

const PrivateSegmentDrawer: React.FC<PrivateSegmentDrawerProps> = ({ id }) => {
  const { deleteNetwork } = useDeleteResourceGroupNetwork();
  const { addNetwork } = useAddResourceGroupNetwork();
  const { networks } = useResourceGroupNetworks(id);
  const form = useForm<CreateSegmentSchema>({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: {
      name: "",
    },
  });
  const networkToDelete = React.useRef<string>();
  const { open } = useDialog();

  const handleSubmit = form.handleSubmit((data) => {
    addNetwork({ id, ...data });
    form.reset();
  });
  return (
    <>
      <ConfirmationDialog
        onConfirm={() => deleteNetwork(networkToDelete.current!)}
        header="Delete network"
        text="Are you sure you want to delete this network?"
      />
      <Sheet>
        <SheetTrigger asChild>
          <Button>Private segments</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Manage private segments</SheetTitle>
            <SheetDescription>
              Here you can manage this resource group private network segments.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6">
            <Form {...form}>
              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <h3>Create new segment</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Segment name..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-end">
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
            <h3>Existing segments</h3>
            <DataTable
              columns={columns((id) => {
                networkToDelete.current = id;
                open("confirmation");
              })}
              data={networks ?? []}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PrivateSegmentDrawer;
