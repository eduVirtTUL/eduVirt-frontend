import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVm } from "@/data/resources/useVm";
import {
  ClipboardPenLineIcon,
  ClipboardXIcon,
  MousePointer2Icon,
} from "lucide-react";
import BounceLoader from "react-spinners/BounceLoader";

type InterfaceListProps = {
  id?: string;
};

const InterfaceList: React.FC<InterfaceListProps> = ({ id }) => {
  const { vm, isLoading } = useVm(id);

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
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Interfaces</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full overflow-hidden">
          <div className="flex flex-col h-full gap-2 overflow-y-scroll">
            {vm?.nics?.map((nic) => (
              <div
                key={nic.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-semibold">{nic.name}</span>
                    {nic.profileName && <Badge variant="outline">Public</Badge>}
                  </div>
                  <span>MAC: 56:6f:73:d3:00:05</span>
                  {nic.profileName && <span>Profile: {nic.profileName}</span>}
                </div>
                {!nic.profileName && (
                  <Button>
                    <ClipboardPenLineIcon />
                    Assign
                  </Button>
                )}
              </div>
            ))}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-center">
                  <span className="font-semibold">Nic Name</span>
                  <Badge>Public</Badge>
                </div>
                <span>MAC: 56:6f:73:d3:00:05</span>
                <span>Profile: Profile Name</span>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-center">
                  <span className="font-semibold">Nic Name</span>
                </div>
                <span>MAC: 56:6f:73:d3:00:05</span>
              </div>
              <Button>
                <ClipboardPenLineIcon />
                Attach
              </Button>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-center">
                  <span className="font-semibold">Nic Name</span>
                  <Badge variant="outline">Private</Badge>
                </div>
                <span>MAC: 56:6f:73:d3:00:05</span>
                <span>Segment: Segment Name</span>
              </div>
              <Button variant="destructive">
                <ClipboardXIcon />
                Detach
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InterfaceList;
