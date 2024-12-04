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
import React, { useState } from "react";
import { useAddKeyToCourse } from "@/data/course/useAddKeyToCourse";

interface AddCourseKeyDialogProps {
  courseId: string;
}

const AddCourseKeyDialog = ({ courseId }: AddCourseKeyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const { addKeyToCourse } = useAddKeyToCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addKeyToCourse({ courseId, key });
    setOpen(false);
    setKey("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Course Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Course Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="key">Course Key</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter course key..."
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Key
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseKeyDialog;