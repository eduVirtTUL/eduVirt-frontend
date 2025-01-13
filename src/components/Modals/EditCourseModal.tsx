import React from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useCourse } from "@/data/course/useCourse";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateCourse } from "@/data/course/useUpdateCourse";
import { useDialog } from "@/stores/dialogStore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { SaveIcon, XCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { TFunction } from "i18next";

type EditCourseModalProps = {
  id: string;
};

const editCourseSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("editCourseModal.validation.nameRequired"))
      .max(50, t("editCourseModal.validation.nameMaxLenght")),
    description: z
      .string()
      .max(1000, t("editCourseModal.validation.descriptionMaxLenght")),
    externalLink: z
      .string()
      .max(1000, t("editCourseModal.validation.externalLinkMaxLenght"))
      .url(t("editCourseModal.validation.externalLinkShouldBeUrl"))
      .or(z.literal("")),
  });

type EditCourseForm = z.infer<ReturnType<typeof editCourseSchema>>;

const EditCourseModal: React.FC<EditCourseModalProps> = ({ id }) => {
  const { t } = useTranslation();
  const { isOpen, close } = useDialog();
  const { course } = useCourse(id);
  const { updateCourseAsync } = useUpdateCourse();
  const form = useForm<EditCourseForm>({
    resolver: zodResolver(editCourseSchema(t)),
    values: {
      name: course?.name ?? "",
      description: course?.description ?? "",
      externalLink: course?.externalLink ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(
    async ({ name, description, externalLink }) => {
      await updateCourseAsync({
        id,
        name,
        description: description === "" ? undefined : description,
        externalLink: externalLink === "" ? undefined : externalLink,
      });
      close();
    }
  );

  return (
    <Dialog
      open={isOpen("editCourse")}
      onOpenChange={() => {
        close();
        form.reset({
          name: course?.name ?? "",
          description: course?.description ?? "",
          externalLink: course?.externalLink ?? "",
        });
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editCourseModal.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormDescription>{t("requiredFieldDescription")}</FormDescription>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("editCourseModal.name")}</FormLabel>
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
                  <FormLabel>{t("editCourseModal.description")}</FormLabel>
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
                  <FormLabel>{t("editCourseModal.externalLink")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <Button type="button" variant="secondary" onClick={() => close()}>
                <XCircleIcon />
                {t("cancel")}
              </Button>
              <Button type="submit">
                <SaveIcon />
                {t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;
