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
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useCreateTeam } from "@/data/team/useCreateTeam";

interface CreateTeamDialogProps {
  courseId: string;
}

const CreateTeamDialog = ({ courseId }: CreateTeamDialogProps) => {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [maxSize, setMaxSize] = useState<number>(3);
  const [key, setKey] = useState("");
  const { createTeam } = useCreateTeam();

  useEffect(() => {
    if (teamName) {
      const generatedKey = `${teamName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
      setKey(generatedKey);
    } else {
      setKey("");
    }
  }, [teamName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.length < 4 || key.length > 16) {
      return; // Prevent submission if key length is invalid
    }
    createTeam({
      name: teamName,
      courseId: courseId,
      maxSize: maxSize,
      key: key,
    });
    setOpen(false);
    setTeamName("");
    setMaxSize(5);
    setKey("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name..."
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="key">Team Key (4-16 characters)</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              minLength={4}
              maxLength={16}
              placeholder="Enter team key..."
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="maxSize">Maximum Team Size</Label>
            <Input
              id="maxSize"
              type="number"
              min={1}
              value={maxSize}
              onChange={(e) => setMaxSize(parseInt(e.target.value))}
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;