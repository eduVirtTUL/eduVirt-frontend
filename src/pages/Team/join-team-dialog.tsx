import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useJoinTeamOrCourse } from "@/data/team/useJoinTeamOrCourse";

const JoinTeamDialog = () => {
  const [open, setOpen] = useState(false);
  const [teamKey, setTeamKey] = useState("");
  const { joinTeam } = useJoinTeamOrCourse();

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
          <DialogTitle>Enter Team Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="teamKey"
              value={teamKey}
              onChange={(e) => setTeamKey(e.target.value)}
              placeholder="Team Key"
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

export default JoinTeamDialog;