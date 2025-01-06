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
import { useClusters } from "@/data/cluster/useClusters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const createCourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  courseType: z.enum(["SOLO", "TEAM_BASED"]),
  clusterId: z.string().min(1),
});

type CreateCourseSchema = z.infer<typeof createCourseSchema>;

const CreateCourseModal: React.FC = () => {
  const { isOpen, close } = useDialog();
  const { createCourseAsync } = useCreateCourse();
  const { clusters } = useClusters({ page: 0, size: 10 });

  const form = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: "",
      description: "",
      courseType:"SOLO",
      clusterId: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    console.table(values)
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
          <form onSubmit={handleSubmit} className="space-y-3">
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
              name="clusterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cluster</FormLabel>
                  <Select
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cluster"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clusters?.map((cluster) => (
                        <SelectItem key={cluster.id} value={cluster.id ?? ""}>
                          {cluster.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
  control={form.control}
  name="courseType"
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
          checked={field.value === "TEAM_BASED"}
          onCheckedChange={(checked) => {
            field.onChange(checked ? "TEAM_BASED" : "SOLO");
          }}
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
