import { useDialog } from "@/stores/dialogStore";
import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreatePool } from "@/data/rgPool/useCreatepool";

type CreatePoolModalProps = {
  courseId: string;
};

const createPoolSchema = z.object({
  name: z.string().min(1),
});

type CreatePoolSchema = z.infer<typeof createPoolSchema>;

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ courseId }) => {
  const { createPoolAsync } = useCreatePool();
  const form = useForm<CreatePoolSchema>({
    resolver: zodResolver(createPoolSchema),
    defaultValues: {
      name: "",
    },
  });
  const { isOpen, close } = useDialog();

  const handleSubmit = form.handleSubmit(async ({ name }) => {
    await createPoolAsync({ name, courseId });
    close();
    form.reset();
  });

  return (
    <Dialog
      open={isOpen("createPool")}
      onOpenChange={() => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoolModal;
