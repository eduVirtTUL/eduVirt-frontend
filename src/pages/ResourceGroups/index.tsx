import { ResourceGroupDto } from "@/api";
import DataTable from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { useResourceGroups } from "@/data/resourceGroup/useResourceGroups";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const columns = (t: TFunction): ColumnDef<ResourceGroupDto>[] => [
  { accessorKey: "name", header: t("resourceGroups.table.name") },
  {
    cell: ({ row: { original } }) => (
      <>
        {original.stateless ? (
          <Badge variant="default">{t("resourceGroups.table.stateless")}</Badge>
        ) : (
          <Badge variant="secondary">
            {t("resourceGroups.table.stateful")}
          </Badge>
        )}
      </>
    ),

    header: t("resourceGroups.table.type"),
  },
];

const ResourceGroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const { resourceGroups } = useResourceGroups();
  const nav = useNavigate();

  return (
    <>
      <PageHeader title={t("menu.resourceGroups")} />
      <DataTable
        columns={columns(t)}
        data={resourceGroups ?? []}
        onRowClick={(row) => {
          const rg = row.original;
          nav(`/rg/${rg.id}`);
        }}
      />
    </>
  );
};

export default ResourceGroupsPage;
