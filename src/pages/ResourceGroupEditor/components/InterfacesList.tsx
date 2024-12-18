import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVm } from "@/data/resourceGroup/useResourceGroupVm";
import { MousePointer2Icon } from "lucide-react";
import BounceLoader from "react-spinners/BounceLoader";
import Interface from "./Interface";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDetachNicFromNetwork } from "@/data/resourceGroup/useDetachNicFromNetwork";
import React from "react";
import { useDialog } from "@/stores/dialogStore";

type InterfaceListProps = {
  id?: string;
};

const InterfaceList: React.FC<InterfaceListProps> = ({ id }) => {
  const { close, open } = useDialog();
  const { vm, isLoading } = useVm(id);
  const { detachNicFromNetwork } = useDetachNicFromNetwork();
  const nicId = React.useRef<string>();

  if (!vm && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="flex justify-center items-center gap-2">
            <MousePointer2Icon />
            <span className="text-2xl">Select virtual machine</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interfaces</CardTitle>
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
        onConfirm={() => {
          detachNicFromNetwork({ vmId: vm?.id, nicId: nicId.current });
          close();
        }}
      />
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Interfaces</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full overflow-hidden">
          <div className="flex flex-col h-full gap-2 overflow-y-scroll">
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
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InterfaceList;
