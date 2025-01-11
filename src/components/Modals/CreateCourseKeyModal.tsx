import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useCreateCourseAccessKey } from "@/data/access-key/useCreateCourseAccessKey";
import { useDialog } from "@/stores/dialogStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {CheckIcon, Info, XCircleIcon} from "lucide-react";
import {useTranslation} from "react-i18next";

interface CreateCourseKeyModalProps {
  courseId: string;
}

const CreateCourseKeyModal = ({ courseId }: CreateCourseKeyModalProps) => {
  const [key, setKey] = useState("");
  const { createCourseAccessKey } = useCreateCourseAccessKey();
  const { isOpen, close } = useDialog();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseAccessKey({ courseId, courseKey: key });
    close();
    setKey("");
  };

  return (
    <>
    <Dialog open={isOpen("createCourseKey")} onOpenChange={close}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-2">
          <div className="flex items-center gap-2">
            <DialogTitle>Create Course Access Key</DialogTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </PopoverTrigger>
              <PopoverContent className="w-80" side="top">
                <div className="space-y-2">
                  <p className="font-medium">Course key requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Must be unique across all courses</li>
                    <li>Length must be between 5 and 15 characters</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
            />
          </div>
          <div className="flex flex-row justify-between">
            <Button
                type="button"
                variant="secondary"
                onClick={() => close()}
            >
              <XCircleIcon/>
              {t("cancel")}
            </Button>
            <Button type="submit">
              <CheckIcon/>
              {t("create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default CreateCourseKeyModal;