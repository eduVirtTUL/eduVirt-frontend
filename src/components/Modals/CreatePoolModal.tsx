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
import { useCreatePool } from "@/data/rgPool/useCreatePool";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon, Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useCourses } from "@/data/course/useCourses";

type CreatePoolModalProps = {
  courseId?: string;
};

const createPoolSchema = z.object({
  name: z.string().min(1),
  courseId: z.string().min(1),
});

type CreatePoolSchema = z.infer<typeof createPoolSchema>;

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ courseId }) => {
  const { createPoolAsync } = useCreatePool();
  const { courses } = useCourses();
  const form = useForm<CreatePoolSchema>({
    resolver: zodResolver(createPoolSchema),
    defaultValues: {
      name: "",
      courseId: courseId ?? "",
    },
  });
  const { isOpen, close } = useDialog();

  const handleSubmit = form.handleSubmit(async (values) => {
    await createPoolAsync(values);
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
          <DialogTitle>Create resource group pool</DialogTitle>
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
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Course</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!!courseId}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? courses?.find((c) => c.id === field.value)?.name
                            : "Select Course"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search courses..." />
                        <CommandList>
                          <CommandEmpty>No courses found</CommandEmpty>
                          <CommandGroup>
                            {courses?.map((c) => (
                              <CommandItem
                                value={c.name}
                                key={c.id}
                                onSelect={() => {
                                  form.setValue("courseId", c.id ?? "");
                                }}
                              >
                                {c.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    c.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
