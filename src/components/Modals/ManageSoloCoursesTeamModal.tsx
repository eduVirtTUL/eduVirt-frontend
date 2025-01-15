import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddStudentToCourse } from "@/data/team/users/useAddStudentToCourse";
import { useRemoveStudentFromCourse } from "@/data/team/users/useRemoveStudentFromCourse";
import { XCircleIcon, UserMinusIcon, UserPlus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/stores/dialogStore";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { UserDto } from "@/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStudentsInCourse } from "@/data/course/useStudentsInCourse";

interface ManageSoloCourseUsersModalProps {
    courseId: string;
    courseName: string;
}

const addUserSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type AddUserForm = z.infer<typeof addUserSchema>;

export function ManageSoloCourseUsersModal({ courseId, courseName }: ManageSoloCourseUsersModalProps) {
    const { isOpen, close, open } = useDialog();
    const { t } = useTranslation();
    const { removeStudentFromCourse } = useRemoveStudentFromCourse();
    const { addStudentToCourse } = useAddStudentToCourse();
    const { students, isLoading } = useStudentsInCourse(courseId);
    const [activeTab, setActiveTab] = useState("current");
    const [isRemoving, setIsRemoving] = useState<string | null>(null);
    const [userToRemove, setUserToRemove] = useState<UserDto | null>(null);

    const form = useForm<AddUserForm>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleRemoveClick = (user: UserDto) => {
        setUserToRemove(user);
        open("confirmation");
    };

    const handleConfirmRemove = async () => {
        if (!userToRemove || !userToRemove.email) return;
        
        setIsRemoving(userToRemove.id ?? null);
        try {
            await removeStudentFromCourse({ 
                courseId, 
                email: userToRemove.email 
            });
            close();
        } catch (error) {
            console.error(error);
        } finally {
            setIsRemoving(null);
            setUserToRemove(null);
        }
    };

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
        <>
            <Dialog open={isOpen("manageCourseUsers")} onOpenChange={(open) => !open && close()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t("manageCourseUsers.title")} {courseName}
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="current">
                                {t("manageCourseUsers.remove")}
                            </TabsTrigger>
                            <TabsTrigger value="add">
                                {t("manageCourseUsers.add")}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="current" className="space-y-4">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : !students || students.length === 0 ? (
                                <div className="text-center text-muted-foreground py-4">
                                    {t("manageCourseUsers.noUsers")}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {students.map((user) => (
                                        <div 
                                            key={user.id} 
                                            className="flex items-center justify-between p-2 border rounded-lg"
                                        >
                                            <div className="flex flex-col">
                                                <Badge variant="secondary">
                                                    {user.firstName && user.lastName 
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.userName || user.email}
                                                </Badge>
                                                {user.email && user.email !== user.userName && (
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {user.email}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveClick(user)}
                                                disabled={isRemoving === user.id}
                                            >
                                                <UserMinusIcon className="h-4 w-4 mr-2" />
                                                {t("manageCourseUsers.remove")}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="add" className="space-y-4">
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
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-between">
                        <Button variant="secondary" onClick={() => close()}>
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            {t("cancel")}
                        </Button>
                        {activeTab === "add" && (
                            <Button 
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={!form.formState.isValid}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                {t("manageCourseUsers.add")}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {userToRemove && (
                <ConfirmationDialog
                    header={t("manageCourseUsers.delete.title", {
                        user: userToRemove.firstName && userToRemove.lastName 
                            ? `${userToRemove.firstName} ${userToRemove.lastName}`
                            : userToRemove.userName || userToRemove.email,
                        course: courseName
                    })}
                    text={t("manageCourseUsers.delete.description", {
                        user: userToRemove.firstName && userToRemove.lastName 
                            ? `${userToRemove.firstName} ${userToRemove.lastName}`
                            : userToRemove.userName || userToRemove.email
                    })}
                    onConfirm={handleConfirmRemove}
                />
            )}
        </>
    );
}