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

type InterfaceProps = {
  nic: NicDto;
  vmId: string;
  onDetach?: () => void;
};

const Interface: React.FC<InterfaceProps> = ({ nic, vmId, onDetach }) => {
  const isPublic = !!nic.profileName;
  const isPrivate = !!nic.segmentName;

  if (isPublic && isPrivate) {
    return <ConflictingInterface nic={nic} vmId={vmId} onDetach={onDetach} />;
  }

  if (!isPublic && !isPrivate) {
    return <UnassignedInterface nic={nic} vmId={vmId} />;
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
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
          <Badge variant="outline">Private</Badge>
        </div>
        <span>MAC: {nic.macAddress}</span>
        <span>Segment: {nic.segmentName}</span>
      </div>
      <Button variant="destructive" onClick={onDetach}>
        <ClipboardXIcon />
        Detach
      </Button>
    </div>
  );
};

const PublicInterface: React.FC<InterfaceProps> = ({ nic }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
          <Badge>Public</Badge>
        </div>
        <span>MAC: {nic.macAddress}</span>
        <span>Profile: {nic.profileName}</span>
      </div>
    </div>
  );
};

const UnassignedInterface: React.FC<InterfaceProps> = ({ nic, vmId }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
        </div>
        <span>MAC: {nic.macAddress}</span>
      </div>
      <AttachVmToSegmentModal nicId={nic.id ?? ""} vmId={vmId} />
    </div>
  );
};

const ConflictingInterface: React.FC<InterfaceProps> = ({ nic, onDetach }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-row p-6 justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-semibold">{nic.name}</span>
          <Badge variant="destructive">
            <TriangleAlertIcon className="w-5 h-5 mr-1" />
            Conflict
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelpIcon />
              </TooltipTrigger>
              <TooltipContent>Help me</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span>MAC: {nic.macAddress}</span>
        <span>Segment: {nic.segmentName}</span>
        <span>Profile: {nic.profileName}</span>
      </div>
      <Button variant="destructive" onClick={onDetach}>
        <ClipboardXIcon />
        Detach
      </Button>
    </div>
  );
};

export default Interface;
