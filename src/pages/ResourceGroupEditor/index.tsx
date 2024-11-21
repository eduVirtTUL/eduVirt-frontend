import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useResourceGroup } from "@/data/resourceGroup/useResourceGroup";
import { useResourceGroupVms } from "@/data/resourceGroup/useResourceGroupVms";
import React from "react";
import { useParams } from "react-router-dom";
import AddVmModal from "./AddVmModal";

const ResourceGroupEditor: React.FC = () => {
  const { id } = useParams();
  const { resourceGroup } = useResourceGroup(id!);
  // const { vms, isLoading } = useVms();
  const { vms, isLoading } = useResourceGroupVms(id!);
  const [selectedVm, setSelectedVm] = React.useState<string>();

  return (
    <>
      <PageHeader title="Create resorce group" />
      <p>{resourceGroup?.name}</p>
      <AddVmModal id={id!} />
      <div className="grid grid-cols-4 grid-rows-1 gap-x-5 flex-1 h-full overflow-hidden">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Virtual machines</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 h-full overflow-hidden">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="max-h-full overflow-y-auto">
                <RadioGroup value={selectedVm}>
                  <div className="flex flex-col gap-2">
                    {vms?.map((vm) => (
                      <div
                        key={vm.id}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm"
                      >
                        <div
                          className="flex flex-row w-full items-center p-6 gap-2 cursor-pointer"
                          onClick={() => {
                            setSelectedVm(vm.id);
                          }}
                        >
                          <RadioGroupItem value={vm.id ?? ""} />
                          <p>{vm.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent>Test</CardContent>
        </Card>
        <Card>
          <CardContent>Test</CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResourceGroupEditor;
