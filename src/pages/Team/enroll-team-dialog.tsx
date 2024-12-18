import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { useJoinTeam } from "@/data/team/useJoinTeam";

const EnrollTeamDialog = () => {
  const [open, setOpen] = useState(false);
  const [teamKey, setTeamKey] = useState("");
  const { joinTeam } = useJoinTeam();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinTeam(teamKey);
    setOpen(false);
    setTeamKey("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Join a Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamKey">Team Key</Label>
            <Input
              id="teamKey"
              value={teamKey}
              onChange={(e) => setTeamKey(e.target.value)}
              placeholder="Enter team key..."
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">
            Join
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollTeamDialog;