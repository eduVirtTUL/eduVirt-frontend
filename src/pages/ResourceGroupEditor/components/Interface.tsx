import { NicDto } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CircleHelpIcon,
  ClipboardXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import React from "react";
import AttachVmToSegmentModal from "../modals/AttachVmToSegmentModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useUser } from "@/stores/userStore";

type InterfaceProps = {
  nic: NicDto;
  vmId: string;
  etag?: string;
  onDetach?: () => void;
};

const Interface: React.FC<InterfaceProps> = ({ nic, vmId, onDetach, etag }) => {
  const isPublic = !!nic.profileName;
  const isPrivate = !!nic.segmentName;

  if (isPublic && isPrivate) {
    return <ConflictingInterface nic={nic} vmId={vmId} onDetach={onDetach} />;
  }

  if (!isPublic && !isPrivate) {
    return <UnassignedInterface nic={nic} vmId={vmId} etag={etag} />;
  }

  if (isPublic) {
    return <PublicInterface nic={nic} vmId={vmId} />;
  }

  if (isPrivate) {
    return <PrivateInterface nic={nic} vmId={vmId} onDetach={onDetach} />;
  }

  return null;
};

const PrivateInterface: React.FC<InterfaceProps> = ({ nic, onDetach }) => {
  const { t } = useTranslation();
  const { activeRole } = useUser();
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
          <Badge variant="outline">
            {t("resourceGroupEditor.interfaceList.private")}
          </Badge>
        </div>
        <span>
          {t("resourceGroupEditor.interfaceList.mac")} {nic.macAddress}
        </span>
        <span>
          {t("resourceGroupEditor.interfaceList.segment")} {nic.segmentName}
        </span>
      </div>
      {activeRole === "teacher" && (
        <Button variant="destructive" onClick={onDetach}>
          <ClipboardXIcon />
          {t("resourceGroupEditor.interfaceList.detach")}
        </Button>
      )}
    </div>
  );
};

const PublicInterface: React.FC<InterfaceProps> = ({ nic }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
          <Badge>{t("resourceGroupEditor.interfaceList.public")}</Badge>
        </div>
        <span>
          {t("resourceGroupEditor.interfaceList.mac")} {nic.macAddress}
        </span>
        <span>
          {t("resourceGroupEditor.interfaceList.profile")} {nic.profileName}
        </span>
      </div>
    </div>
  );
};

const UnassignedInterface: React.FC<InterfaceProps> = ({ nic, vmId, etag }) => {
  const { t } = useTranslation();
  const { activeRole } = useUser();
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
        </div>
        <span>
          {t("resourceGroupEditor.interfaceList.mac")} {nic.macAddress}
        </span>
      </div>
      {activeRole === "teacher" && (
        <AttachVmToSegmentModal nicId={nic.id ?? ""} vmId={vmId} etag={etag} />
      )}
    </div>
  );
};

const ConflictingInterface: React.FC<InterfaceProps> = ({ nic, onDetach }) => {
  const { t } = useTranslation();
  const { activeRole } = useUser();
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
          <Badge variant="destructive">
            <TriangleAlertIcon className="w-5 h-5 mr-1" />
            {t("resourceGroupEditor.interfaceList.conflict")}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelpIcon />
              </TooltipTrigger>
              <TooltipContent className="max-w-52">
                {t("resourceGroupEditor.interfaceList.conflictTooltip")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span>MAC: {nic.macAddress}</span>
        <span>Segment: {nic.segmentName}</span>
        <span>Profile: {nic.profileName}</span>
      </div>
      {activeRole === "teacher" && (
        <Button variant="destructive" onClick={onDetach}>
          <ClipboardXIcon />
          {t("resourceGroupEditor.interfaceList.detach")}
        </Button>
      )}
    </div>
  );
};

export default Interface;
