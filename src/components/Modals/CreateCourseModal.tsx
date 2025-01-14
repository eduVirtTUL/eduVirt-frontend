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
import { useTranslation } from "react-i18next";
import { CheckIcon, CircleXIcon } from "lucide-react";
import { TFunction } from "i18next";

const createCourseSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("createCourseModal.validation.nameRequired"))
      .max(50, t("createCourseModal.validation.nameMaxLenght")),
    description: z
      .string()
      .max(1000, t("createCourseModal.validation.descriptionMaxLenght")),
    courseType: z.enum(["SOLO", "TEAM_BASED"]),
    clusterId: z
      .string()
      .min(1, t("createCourseModal.validation.clusterRequired")),
    externalLink: z
      .string()
      .max(1000, t("createCourseModal.validation.externalLinkMaxLenght"))
      .url(t("createCourseModal.validation.externalLinkShouldBeUrl"))
      .or(z.literal("")),
  });

type CreateCourseSchema = z.infer<ReturnType<typeof createCourseSchema>>;

const CreateCourseModal: React.FC = () => {
  const { isOpen, close } = useDialog();
  const { createCourseAsync } = useCreateCourse();
  const { clusters } = useClusters({ page: 0, size: 10, sort: [] });
  const { t } = useTranslation();

  const form = useForm<CreateCourseSchema>({
    resolver: zodResolver(createCourseSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      courseType: "SOLO",
      clusterId: "",
      externalLink: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createCourseAsync({
      ...values,
      description: values.description === "" ? undefined : values.description,
      externalLink:
        values.externalLink === "" ? undefined : values.externalLink,
    });
    close();
    form.reset();
  });

  return (
    <Dialog
      open={isOpen("createCourse")}
      onOpenChange={() => {
        close();
        form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createCourseModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormDescription>{t("requiredFieldDescription")}</FormDescription>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createCourseModal.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>{t("createCourseModal.cluster")}</FormLabel>
                  <Select
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("createCourseModal.selectCluster")}
                        ></SelectValue>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createCourseModal.description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createCourseModal.externalLink")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseType"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t("createCourseB.teamBased.title")}
                      </FormLabel>
                      <FormDescription className="">
                        {field.value === "TEAM_BASED"
                          ? t("createCourseB.teamBased.description.teamBased")
                          : t("createCourseB.teamBased.description.solo")}
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
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <Button
                type="button"
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
                <CheckIcon />
                {t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
