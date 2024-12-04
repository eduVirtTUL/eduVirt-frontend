import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVm } from "@/data/resources/useVm";
import { MousePointer2Icon } from "lucide-react";
import { BounceLoader } from "react-spinners";

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
      <Card>
        <CardHeader>
          <CardTitle>Interfaces</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full overflow-hidden">
          <div className="max-h-full overflow-y-auto">
            <div className="flex flex-col gap-2">
              {vm?.nics?.map((nic) => (
                <div
                  key={nic.id}
                  className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col p-6"
                >
                  <span className="font-semibold text-xl">{nic.name}</span>
                  <span>Profile: {nic.profileName}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InterfaceList;
