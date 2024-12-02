import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useResourceGroupVms } from "@/data/resourceGroup/useResourceGroupVms";
import { BounceLoader } from "react-spinners";

type VirtualMachinesListProps = {
  id: string;
  selectedVm?: string;
  setSelectedVm: (id: string) => void;
};

const VirtualMachinesList: React.FC<VirtualMachinesListProps> = ({
  id,
  selectedVm,
  setSelectedVm,
}) => {
  const { vms, isLoading } = useResourceGroupVms(id);
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Virtual machines</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-hull">
              <BounceLoader color="#1e1e1e" />
            </div>
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
                          setSelectedVm(vm.id ?? "");
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
    </>
  );
};

export default VirtualMachinesList;
