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
    if (key.length < 5 || key.length > 50) {
      return;
    }
    createTeam({
      name: teamName,
      courseId: courseId,
      maxSize: maxSize,
      keyValue: key,
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
          <DialogTitle>Enter Team Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name..."
              className="mt-2"
            />
          </div>
          <div>
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