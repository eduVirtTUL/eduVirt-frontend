import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCourseAccessKey } from "@/data/access-key/useCreateCourseAccessKey";
import { useDialog } from "@/stores/dialogStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {CheckIcon, Info, XCircleIcon} from "lucide-react";
import {useTranslation} from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
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
            <Popover>
              <PopoverTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </PopoverTrigger>
              <PopoverContent className="w-80" side="top">
                <div className="space-y-2">
                  <p className="font-medium">{t("createCourseKey.description.title")}</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>{t("createCourseKey.description.line1")}</li>
                    <li>{t("createCourseKey.description.line2")}</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createCourseKey.keyLabel")}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                    />
                  </FormControl>
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
              <Button type="submit">
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