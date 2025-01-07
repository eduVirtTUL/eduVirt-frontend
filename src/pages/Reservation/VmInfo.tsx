import {useTranslation} from "react-i18next";
import {CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {VmDto} from "@/api";
import {Button} from "@/components/ui/button";
import {Link} from "react-router";
import {ExternalLinkIcon} from "lucide-react";

type UseVmInfoProps = {
  vm: VmDto
};

const VmInfo: React.FC<UseVmInfoProps> = ({
  vm
}) => {
  const { t } = useTranslation();

  return (
    <>
      <CardContent className="flex flex-col items-center space-y-4 p-6 w-3/4 mx-auto">
        {[
          {label: t("reservations.details.rg.vmId"), value: vm.id},
          {label: t("reservations.details.rg.vmName"), value: vm.name},
          {label: t("reservations.details.rg.vmCpuCount"), value: vm.cpuCount},
          {label: t("reservations.details.rg.vmMemory"), value: vm.memory,},
          {
              label: t("reservations.details.rg.hidden"),
              value: vm.hidden ? t("general.yes") : t("general.no")
          },
        ].map((field, index) => (
          <div key={index} className="flex w-full items-center space-x-4">
            <Label className="w-1/3 text-left">{field.label}</Label>
            <Input className="w-2/3" value={field.value || ""} disabled/>
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={(e) => e.stopPropagation()}
          asChild
        >

          <Link
            target="_blank"
            to={`https://vteste1.vlab.it.p.lodz.pl/ovirt-engine/web-ui/vm/${vm.id}`}
          >
            <ExternalLinkIcon/>
            {t("reservations.details.rg.ovirt")}
          </Link>
        </Button>
      </CardContent>
    </>
  );
};

export default VmInfo;