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
import { Role, useUser } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { EthernetPortIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type PrivateSegmentDrawerProps = {
  id: string;
};

const columns = (
  t: TFunction,
  activeRole: Role,
  initDelete: (id: string) => void
): ColumnDef<ResourceGroupNetworkDto>[] => [
  {
    accessorKey: "name",
    header: t("resourceGroupEditor.privateSegments.name"),
  },
  {
    id: "nics",
    accessorFn: (row) => row.interfaces?.length ?? 0,
    header: t("resourceGroupEditor.privateSegments.interfaces"),
  },
  {
    id: "actions",
    header: t("resourceGroupEditor.privateSegments.actions"),
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
              disabled={activeRole !== "teacher"}
              onClick={() => {
                initDelete(network.id!);
              }}
            >
              <Trash2Icon />
              {t("resourceGroupEditor.privateSegments.delete")}
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
  const { t } = useTranslation();
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
  const { activeRole } = useUser();

  const handleSubmit = form.handleSubmit((data) => {
    addNetwork({ id, ...data });
    form.reset();
  });
  return (
    <>
      <ConfirmationDialog
        onConfirm={() => deleteNetwork(networkToDelete.current!)}
        header={t("resourceGroupEditor.privateSegments.deleteConfirmation")}
        text={t("resourceGroupEditor.privateSegments.deleteConfirmationText")}
      />
      <Sheet>
        <SheetTrigger asChild>
          <Button>
            <EthernetPortIcon />
            {t("resourceGroupEditor.privateSegments.button")}
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xl h-screen overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {t("resourceGroupEditor.privateSegments.title")}
            </SheetTitle>
            <SheetDescription>
              {t("resourceGroupEditor.privateSegments.description")}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6">
            {activeRole === "teacher" && (
              <Form {...form}>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                  <h3>
                    {t("resourceGroupEditor.privateSegments.createSegment")}
                  </h3>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("resourceGroupEditor.privateSegments.name")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t(
                              "resourceGroupEditor.privateSegments.placeholder"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-end">
                    <Button type="submit">
                      {t("resourceGroupEditor.privateSegments.create")}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
            <h3>{t("resourceGroupEditor.privateSegments.segments")}</h3>
            <DataTable
              columns={columns(t, activeRole, (id) => {
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
