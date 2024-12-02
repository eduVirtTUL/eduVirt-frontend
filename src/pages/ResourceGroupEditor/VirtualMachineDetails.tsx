import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVm } from "@/data/resources/useVm";
import { MousePointer2Icon, SquareArrowOutUpRightIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import AddPrivateSegmentModal from "./AddPrivateSegmentModal";
import AttachVmToSegmentModal from "./AttachVmToSegmentModal";

type VirtualMachineDetailsProps = {
  vmId?: string;
};

const VirtualMachineDetails: React.FC<VirtualMachineDetailsProps> = ({
  vmId,
}) => {
  const { id } = useParams();
  const { vm, isLoading } = useVm(vmId);

  console.log(vm, isLoading);

  if (!vm && !isLoading) {
    return (
      <Card className="col-span-2">
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

  return (
    <>
      <div className="col-span-2 flex flex-col flex-1 h-full">
        <Tabs
          defaultValue="details"
          className="h-full flex flex-col items-start"
        >
          <TabsList className="bg-transparent">
            <TabsTrigger
              className="data-[state=active]:text-red-700"
              value="details"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:text-red-700"
              value="private"
            >
              Add private segment
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:text-red-700"
              value="edit"
            >
              Edit
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="w-full flex-1">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between">
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 h-full overflow-hidden">
                <Button asChild variant="secondary">
                  <Link
                    target="_blank"
                    to={`https://vteste2.vlab.it.p.lodz.pl/ovirt-engine/webadmin/?locale=en_US#vms-general;name=${vm?.name}`}
                  >
                    <SquareArrowOutUpRightIcon />
                    Go to oVirt
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="private" className="w-full flex-1">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between">
                  Add privat segment
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 h-full overflow-hidden">
                <AddPrivateSegmentModal id={id!} />
                <AttachVmToSegmentModal id={id!} vmId={vmId!} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="edit" className="w-full flex-1">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between">
                  Edit
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 h-full overflow-hidden"></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default VirtualMachineDetails;
