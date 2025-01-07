import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ValueDisplay from "@/components/ValueDisplay";
import { useResourceGroupPool } from "@/data/rgPool/useResourceGroupPool";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Route } from "./+types/index";
import { useDialog } from "@/stores/dialogStore";
import CreateResourceGroupModal from "@/components/Modals/CreateResourceGroupModal";
import { useCreateStatelessResourceGroup } from "@/data/rgPool/useCreateStatelessResourceGroup";
import ResourceGroupCard from "./ResourceGroupCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteResourceGroupPool } from "@/data/rgPool/useDeleteResourceGroupPool";
import { useNavigate } from "react-router";
import EditResourceGroupPoolModal from "@/components/Modals/EditResourceGroupPoolModal";
import { useTranslation } from "react-i18next";
import { convertMinutesToHoures } from "@/utils/timeUtils";

const ResourceGroupPoolPage: React.FC<Route.ComponentProps> = ({
  params: { id },
}) => {
  const { t } = useTranslation();
  const { open } = useDialog();
  const { resourceGroupPool } = useResourceGroupPool(id);
  const { createStatelessResourceGroupAsync } =
    useCreateStatelessResourceGroup();

  const { deleteResourceGroupPoolAsync } = useDeleteResourceGroupPool();
  const nav = useNavigate();

  return (
    <>
      <ConfirmationDialog
        text={t("resourceGroupPoolPage.deleteConfirmationText")}
        header={t("resourceGroupPoolPage.deleteConfirmation")}
        onConfirm={async () => {
          await deleteResourceGroupPoolAsync(id);
          nav("/pools");
        }}
      />
      <CreateResourceGroupModal
        isPool
        onCreate={async (data) => {
          await createStatelessResourceGroupAsync({ id, ...data });
        }}
      />
      <PageHeader title={resourceGroupPool?.name ?? ""} />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-row items-center justify-between">
                <span>{t("resourceGroupPoolPage.poolSettings")}</span>
                <div className="flex flex-row items-center justify-start gap-2">
                  <EditResourceGroupPoolModal poolId={id} />
                  <Button
                    variant="destructive"
                    onClick={() => open("confirmation")}
                  >
                    <Trash2Icon />
                    {t("resourceGroupPoolPage.delete")}
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <ValueDisplay
                value={resourceGroupPool?.name ?? ""}
                label={t("resourceGroupPoolPage.fields.name")}
              />
              <ValueDisplay
                value={resourceGroupPool?.course?.name ?? ""}
                label={t("resourceGroupPoolPage.fields.course")}
              />
              <div className="col-span-2">
                <ValueDisplay
                  value={resourceGroupPool?.description ?? ""}
                  label={t("resourceGroupPoolPage.fields.description")}
                />
              </div>
              <ValueDisplay
                value={resourceGroupPool?.maxRent ?? 0}
                label={t("resourceGroupPoolPage.fields.maxRent")}
              />
              <ValueDisplay
                value={
                  convertMinutesToHoures(resourceGroupPool?.gracePeriod ?? 0) +
                  " h"
                }
                label={t("resourceGroupPoolPage.fields.gracePeriod")}
              />
              <ValueDisplay
                value={
                  convertMinutesToHoures(resourceGroupPool?.maxRentTime ?? 0) +
                  " h"
                }
                label={t("resourceGroupPoolPage.fields.maxRentTime")}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("resourceGroupPoolPage.resourceGroups")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-start">
              <Button onClick={() => open("createResourceGroup")}>
                <PlusIcon />
                {t("resourceGroupPoolPage.createResourceGroup")}
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {resourceGroupPool?.resourceGroups?.map((rg) => (
                <ResourceGroupCard resourceGroup={rg} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResourceGroupPoolPage;
