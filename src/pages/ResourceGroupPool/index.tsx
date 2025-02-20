import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ValueDisplay from "@/components/ValueDisplay";
import { useResourceGroupPool } from "@/data/rgPool/useResourceGroupPool";
import { CalendarIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Route } from "./+types/index";
import { useDialog } from "@/stores/dialogStore";
import CreateResourceGroupModal from "@/components/Modals/CreateResourceGroupModal";
import { useCreateStatelessResourceGroup } from "@/data/rgPool/useCreateStatelessResourceGroup";
import ResourceGroupCard from "./ResourceGroupCard";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteResourceGroupPool } from "@/data/rgPool/useDeleteResourceGroupPool";
import { useLocation, useNavigate } from "react-router";
import EditResourceGroupPoolModal from "@/components/Modals/EditResourceGroupPoolModal";
import { useTranslation } from "react-i18next";
import { convertMinutesToHoures } from "@/utils/timeUtils";
import { RouteHandle } from "@/AuthGuard";
import i18next from "i18next";
import { useUser } from "@/stores/userStore";

const ResourceGroupPoolPage: React.FC<Route.ComponentProps> = ({
  params: { id },
}) => {
  const { t } = useTranslation();
  const { open } = useDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const { resourceGroupPool } = useResourceGroupPool(id);
  const { createStatelessResourceGroupAsync } =
    useCreateStatelessResourceGroup();

  const { courseId, clusterId } = location.state || {};

  const { deleteResourceGroupPoolAsync } = useDeleteResourceGroupPool();
  const nav = useNavigate();
  const { activeRole } = useUser();

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
      <EditResourceGroupPoolModal poolId={id} />
      <PageHeader
        title={resourceGroupPool?.name ?? ""}
        type={t("resourceGroupPoolPage.type")}
      />
      {activeRole === "teacher" && (
        <div className="flex flex-row items-center justify-end gap-2 pb-5">
          <Button
            variant="secondary"
            onClick={() => open("editResourceGroupPool")}
          >
            <PencilIcon />
            {t("editResourceGroupPoolModal.button")}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(
                `/reservations/calendar/resource-group-pool/presentation/${id}`,
                {
                  state: { clusterId, courseId },
                }
              )
            }
          >
            <CalendarIcon />
            {t("resourceGroupPoolPage.calendar")}
          </Button>
          <Button variant="destructive" onClick={() => open("confirmation")}>
            <Trash2Icon />
            {t("resourceGroupPoolPage.delete")}
          </Button>
        </div>
      )}
      {activeRole === "administrator" && (
        <>
          <div className="flex flex-row items-center justify-end gap-2 pb-5">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  `/reservations/calendar/resource-group-pool/presentation/${id}`,
                  {
                    state: { clusterId, courseId },
                  }
                )
              }
            >
              <CalendarIcon />
              {t("resourceGroupPoolPage.calendar")}
            </Button>
          </div>
        </>
      )}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("resourceGroupPoolPage.poolSettings")}</CardTitle>
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
                  value={resourceGroupPool?.description ?? "-"}
                  label={t("resourceGroupPoolPage.fields.description")}
                />
              </div>
              <ValueDisplay
                value={resourceGroupPool?.maxRent ?? 0}
                label={t("resourceGroupPoolPage.fields.maxRent")}
              />
              <ValueDisplay
                value={`${convertMinutesToHoures(resourceGroupPool?.gracePeriod ?? 0)} ${t("houres")}`}
                label={t("resourceGroupPoolPage.fields.gracePeriod")}
              />
              <ValueDisplay
                value={`${convertMinutesToHoures(resourceGroupPool?.maxRentTime ?? 0)} ${t("houres")}`}
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
            {activeRole === "teacher" && (
              <div className="flex flex-row items-start">
                <Button onClick={() => open("createResourceGroup")}>
                  <PlusIcon />
                  {t("resourceGroupPoolPage.createResourceGroup")}
                </Button>
              </div>
            )}
            <div className="grid grid-cols-4 gap-4">
              {resourceGroupPool?.resourceGroups?.map((rg) => (
                <ResourceGroupCard
                  resourceGroup={rg}
                  courseId={courseId}
                  clusterId={clusterId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResourceGroupPoolPage;

export const handle: RouteHandle = {
  roles: ["administrator", "teacher"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.resourceGroupPool") }];
};
