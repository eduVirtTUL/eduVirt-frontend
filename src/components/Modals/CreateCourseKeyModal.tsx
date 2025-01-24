import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCourseAccessKey } from "@/data/access-key/useCreateCourseAccessKey";
import { useDialog } from "@/stores/dialogStore";
import {CheckIcon, XCircleIcon} from "lucide-react";
import {useTranslation} from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {t} from "i18next";

interface CreateCourseKeyModalProps {
  courseId: string;
}

const formSchema = z.object({
  key: z.string()
    .min(4, t("createCourseKey.validation.keyMinLength"))
    .max(20, t("createCourseKey.validation.keyMaxLength"))
    .regex(/^[a-zA-Z0-9\s\-_]+$/, t("createCourseKey.validation.keyRegex"))
});

const CreateCourseKeyModal = ({ courseId }: CreateCourseKeyModalProps) => {
  const { createCourseAccessKey } = useCreateCourseAccessKey();
  const { isOpen, close } = useDialog();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCourseAccessKey({ courseId, courseKey: values.key });
    close();
    form.reset();
  };

  return (
    <Dialog open={isOpen("createCourseKey")} onOpenChange={close}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center gap-2">
          <div className="flex items-center gap-2">
            <DialogTitle>{t("createCourseKey.title")}</DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
        <FormDescription>{t("requiredFieldDescription")}</FormDescription>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createCourseKey.keyLabel")}*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                    <li>{t("createCourseKey.description.line1")}</li>
                    <li>{t("createCourseKey.description.line2")}</li>
                    <li>{t("createCourseKey.description.line3")}</li>
                  </ul>
                  </FormDescription>
                  <FormMessage />
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
                <XCircleIcon className="mr-2 h-4 w-4" />
                {t("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={!form.formState.isValid || !form.formState.isDirty}>
                <CheckIcon className="mr-2 h-4 w-4" />
                {t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseKeyModal;