import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { useCreateCourse } from "@/data/course/useCreateCourse";
import { useDialog } from "@/stores/dialogStore";

const createCourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  teamBased: z.boolean().default(false),
});

type CreateCourseSchema = z.infer<typeof createCourseSchema>;

const CreateCourseModal: React.FC = () => {
  const { isOpen, close } = useDialog();
  const { createCourseAsync } = useCreateCourse();

  const form = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: "",
      description: "",
      teamBased: false,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createCourseAsync(values);
    close();
    form.reset();
  });

  return (
    <Dialog
      open={isOpen("createCourse")}
      onOpenChange={() => {
        close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamBased"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Team Based</FormLabel>
                    <FormDescription>
                      Enable team-based features for this course
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Create Course</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
