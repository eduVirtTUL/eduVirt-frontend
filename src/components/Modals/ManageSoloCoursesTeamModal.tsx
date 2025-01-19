import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddStudentToCourse } from "@/data/team/users/useAddStudentToCourse";
import { XCircleIcon, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/stores/dialogStore";;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ManageSoloCourseUsersModalProps {
    courseId: string;
    courseName: string;
}

const addUserSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type AddUserForm = z.infer<typeof addUserSchema>;

export function ManageSoloCourseUsersModal({ courseId, courseName }: ManageSoloCourseUsersModalProps) {
    const { isOpen, close } = useDialog();
    const { t } = useTranslation();
    const { addStudentToCourse } = useAddStudentToCourse();
    const form = useForm<AddUserForm>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: AddUserForm) => {
        try {
            await addStudentToCourse({ 
                courseId, 
                email: values.email 
            });
            form.reset();
            close();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen("manageCourseUsers")} onOpenChange={(open) => !open && close()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {t("manageCourseUsers.title")} {courseName}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("manageCourseUsers.addUser.email")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t("manageCourseUsers.addUser.description")}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => close()}>
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        {t("cancel")}
                    </Button>
                    <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={!form.formState.isValid}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t("manageCourseUsers.add")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}