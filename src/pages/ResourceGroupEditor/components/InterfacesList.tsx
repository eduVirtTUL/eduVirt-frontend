import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVm } from "@/data/resourceGroup/useResourceGroupVm";
import { CircleSlashIcon, MousePointerClickIcon } from "lucide-react";
import BounceLoader from "react-spinners/BounceLoader";
import Interface from "./Interface";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDetachNicFromNetwork } from "@/data/resourceGroup/useDetachNicFromNetwork";
import React from "react";
import { useDialog } from "@/stores/dialogStore";
import { useTranslation } from "react-i18next";

type InterfaceListProps = {
  id?: string;
};

const InterfaceList: React.FC<InterfaceListProps> = ({ id }) => {
  const { t } = useTranslation();
  const { close, open } = useDialog();
  const { vm, isLoading } = useVm(id);
  const { detachNicFromNetwork } = useDetachNicFromNetwork();
  const nicId = React.useRef<string>();

  if (!vm && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("resourceGroupEditor.interfaceList.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="flex items-center h-full flex-col gap-4">
            <MousePointerClickIcon className="w-12 h-12" />
            <span className="text-xl font-semibold">
              {t("resourceGroupEditor.interfaceList.selectVirtualMachine")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("resourceGroupEditor.interfaceList.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full overflow-hidden">
          <div className="flex justify-center items-center min-h-hull">
            <BounceLoader color="#1e1e1e" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ConfirmationDialog
        header="Are you sure you want to detach this interface?"
        text="This action will detach the interface from the network. Virtual machine will lose connection with this network. You can reattach the interface later. Do you want to continue?"
        onConfirm={() => {
          detachNicFromNetwork({ vmId: vm?.id, nicId: nicId.current });
          close();
        }}
      />
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{t("resourceGroupEditor.interfaceList.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full overflow-hidden">
          <div className="flex flex-col h-full gap-2 overflow-y-auto">
            {vm?.nics?.length === 0 ? (
              <div className="flex items-center h-full flex-col gap-4">
                <CircleSlashIcon className="w-12 h-12" />
                <span className="text-xl font-semibold">
                  {t("resourceGroupEditor.interfaceList.noInterfaces")}
                </span>
              </div>
            ) : (
              <>
                {vm?.nics?.map((nic) => (
                  <Interface
                    key={nic.id}
                    nic={nic}
                    vmId={vm.id ?? ""}
                    onDetach={() => {
                      nicId.current = nic.id;
                      open("confirmation");
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InterfaceList;
