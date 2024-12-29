import { useDialog } from "@/stores/dialogStore";
import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ChevronsUpDownIcon, Check, CircleXIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useCourses } from "@/data/course/useCourses";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

type CreatePoolModalProps = {
  courseId?: string;
};

const createPoolSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("createResourceGroupPoolModal.validation.nameRequired")),
    courseId: z
      .string()
      .min(1, t("createResourceGroupPoolModal.validation.courseRequired")),
    maxRent: z.coerce
      .number()
      .min(
        0,
        t("createResourceGroupPoolModal.validation.maxRentGreaterOrEqualZero")
      ),
    gracePeriod: z.coerce
      .number()
      .min(
        0,
        t(
          "createResourceGroupPoolModal.validation.gracePeriodGreaterOrEqualZero"
        )
      ),
  });

type CreatePoolSchema = z.infer<ReturnType<typeof createPoolSchema>>;

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const { createPoolAsync } = useCreatePool();
  const { courses } = useCourses();
  const form = useForm<CreatePoolSchema>({
    resolver: zodResolver(createPoolSchema(t)),
    defaultValues: {
      name: "",
      courseId: courseId ?? "",
      maxRent: 0,
      gracePeriod: 0,
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
        form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createResourceGroupPoolModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.name")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.maxRent")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    {t("createResourceGroupPoolModal.maxRentDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gracePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("createResourceGroupPoolModal.gracePeriod")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    {t("createResourceGroupPoolModal.gracePeriodDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {t("createResourceGroupPoolModal.course")}
                  </FormLabel>
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
                            : t("createResourceGroupPoolModal.selectCourse")}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder={t(
                            "createResourceGroupPoolModal.searchCourses"
                          )}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {t("createResourceGroupPoolModal.noCourses")}
                          </CommandEmpty>
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
            <div className="flex flex-row justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  close();
                  form.reset();
                }}
              >
                <CircleXIcon />
                {t("cancel")}
              </Button>
              <Button type="submit">
                <Check />
                {t("createResourceGroupPoolModal.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoolModal;
