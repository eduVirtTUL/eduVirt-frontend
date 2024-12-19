import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useResourceGroupVms } from "@/data/resourceGroup/useResourceGroupVms";
import { ExternalLinkIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import BounceLoader from "react-spinners/BounceLoader";

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
                        className="flex flex-row w-full items-center p-6 gap-4 cursor-pointer"
                        onClick={() => {
                          setSelectedVm(vm.id ?? "");
                        }}
                      >
                        <RadioGroupItem value={vm.id ?? ""} />
                        <div className="flex flex-row items-center justify-between w-full flex-wrap gap-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center gap-2">
                              <span className="font-semibold">{vm.name}</span>
                              <Badge variant="outline">Hidden</Badge>
                            </div>

                            <div className="flex flex-row flex-wrap gap-2">
                              <Badge>{vm.cpuCount} vCPU</Badge>
                              <Badge>{vm.memory ?? 0} MiB</Badge>
                              <Badge>{vm.nics?.length} NICs</Badge>
                            </div>
                          </div>
                          <div className="flex flex-row gap-2 items-center flex-wrap">
                            <Button onClick={(e) => e.stopPropagation()}>
                              Edit
                              <SquarePenIcon />
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={(e) => e.stopPropagation()}
                              asChild
                            >
                              <Link
                                target="_blank"
                                to={`https://vteste1.vlab.it.p.lodz.pl/ovirt-engine/webadmin/?locale=en_US#vms-general;name=${vm?.name}`}
                              >
                                oVirt
                                <ExternalLinkIcon />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2Icon />
                            </Button>
                          </div>
                        </div>
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
