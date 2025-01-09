import { useDialog } from "@/stores/dialogStore";
import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm, useFormContext } from "react-hook-form";
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
import {
  ChevronsUpDownIcon,
  Check,
  CircleXIcon,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
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
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent } from "../ui/tabs";
import RentTimeSelector from "../RentTimeSelector";

type CreatePoolModalProps = {
  courseId?: string;
};

const createPoolSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("createResourceGroupPoolModal.validation.nameRequired"))
      .max(50, t("createResourceGroupPoolModal.validation.nameMaxLength")),
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
    description: z
      .string()
      .min(1, t("createResourceGroupPoolModal.validation.descriptionRequired"))
      .max(
        1000,
        t("createResourceGroupPoolModal.validation.descriptionMaxLength")
      ),
    maxRentTime: z.coerce
      .number()
      .min(
        0,
        t(
          "createResourceGroupPoolModal.validation.maxRentTimeGreaterOrEqualZero"
        )
      ),
  });

type CreatePoolSchema = z.infer<ReturnType<typeof createPoolSchema>>;

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({ courseId }) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { createPoolAsync } = useCreatePool();
  const form = useForm<CreatePoolSchema>({
    resolver: zodResolver(createPoolSchema(t)),
    defaultValues: {
      name: "",
      courseId: courseId ?? "",
      maxRent: 0,
      gracePeriod: 0,
      description: "",
      maxRentTime: 0,
    },
  });
  const [activeTab, setActiveTab] = React.useState("general");

  const handleSubmit = form.handleSubmit(async (values) => {
    await createPoolAsync(values);
    close();
    form.reset();
    setActiveTab("general");
  });

  return (
    <Dialog
      open={isOpen("createPool")}
      onOpenChange={() => {
        close();
        form.reset();
        setActiveTab("general");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createResourceGroupPoolModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="general">
                <FormGeneralStage
                  control={form.control}
                  courseId={courseId}
                  setActiveTab={setActiveTab}
                />
              </TabsContent>
              <TabsContent value="settings">
                <FormSettingsStage
                  control={form.control}
                  courseId={courseId}
                  setActiveTab={setActiveTab}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type FormStageProps = {
  control: Control<CreatePoolSchema>;
  courseId?: string;
  setActiveTab: (tab: string) => void;
};

const FormGeneralStage: React.FC<FormStageProps> = ({
  control,
  courseId,
  setActiveTab,
}) => {
  const { t } = useTranslation();
  const { courses } = useCourses();
  const form = useFormContext<CreatePoolSchema>();
  const { close } = useDialog();

  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("createResourceGroupPoolModal.name")}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("createResourceGroupPoolModal.description")}
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="courseId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t("createResourceGroupPoolModal.course")}</FormLabel>
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
                      ? courses?.items?.find((c) => c.id === field.value)?.name
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
                      {courses?.items?.map((c) => (
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
                              c.id === field.value ? "opacity-100" : "opacity-0"
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
      <div className="flex flex-row justify-between col-span-2">
        <Button
          variant="secondary"
          onClick={() => {
            form.reset();
            close();
          }}
        >
          <CircleXIcon />
          {t("cancel")}
        </Button>
        <Button
          disabled={
            !(
              form.getFieldState("name").isDirty &&
              form.getFieldState("description").isDirty
            )
          }
          onClick={async () => {
            await form.trigger();

            const isStageInvalid =
              form.getFieldState("name").invalid ||
              form.getFieldState("courseId").invalid ||
              form.getFieldState("description").invalid;

            if (isStageInvalid) return;

            setActiveTab("settings");
          }}
        >
          {t("next")}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

const FormSettingsStage: React.FC<FormStageProps> = ({
  control,
  setActiveTab,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={control}
        name="maxRentTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("createResourceGroupPoolModal.maxRentTime")}
            </FormLabel>
            <FormControl>
              <RentTimeSelector
                value={field.value.toString()}
                onChange={field.onChange}
                start={0}
                stop={5 * 60}
                step={20}
              />
            </FormControl>
            <FormDescription>
              {t("createResourceGroupPoolModal.maxRentTimeDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="maxRent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("createResourceGroupPoolModal.maxRent")}</FormLabel>
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
        control={control}
        name="gracePeriod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("createResourceGroupPoolModal.gracePeriod")}
            </FormLabel>
            <FormControl>
              <RentTimeSelector
                value={field.value.toString()}
                onChange={field.onChange}
                start={0}
                stop={4 * 60}
                step={30}
              />
            </FormControl>
            <FormDescription>
              {t("createResourceGroupPoolModal.gracePeriodDescription")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-row justify-between col-span-2">
        <Button
          variant="secondary"
          onClick={() => {
            setActiveTab("general");
          }}
        >
          <ArrowLeft />
          {t("previous")}
        </Button>
        <Button type="submit">
          <Check />
          {t("createResourceGroupPoolModal.create")}
        </Button>
      </div>
    </div>
  );
};

export default CreatePoolModal;
