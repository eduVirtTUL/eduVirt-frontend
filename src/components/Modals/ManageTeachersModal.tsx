import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useAddTeachersToCourse} from "@/data/course/teachers/useAddTeachersToCourse";
import {useRemoveTeachersFromCourse} from "@/data/course/teachers/useRemoveTeachersFromCourse";
import {useGetTeachersForCourse} from "@/data/course/teachers/useGetTeachersForCourse";
import {UserMinusIcon, UserPlus, XCircleIcon} from "lucide-react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useDialog} from "@/stores/dialogStore";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import {UserDto} from "@/api";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { t } from "i18next";

interface ManageTeachersModalProps {
    courseId: string;
    courseName: string;
}

const addTeacherSchema = z.object({
    email: z.string().email(t("manageTeachers.addTeacher.validation.email")),
});

type AddTeacherForm = z.infer<typeof addTeacherSchema>;

export function ManageTeachersModal({courseId, courseName}: ManageTeachersModalProps) {
    const {isOpen, close, open} = useDialog();
    const {t} = useTranslation();
    const {removeTeacherFromCourse} = useRemoveTeachersFromCourse();
    const {addTeacherToCourse} = useAddTeachersToCourse();
    const {teachers, isLoading} = useGetTeachersForCourse(courseId);
    const [activeTab, setActiveTab] = useState("current");
    const [teacherToRemove, setTeacherToRemove] = useState<UserDto | null>(null);

    const form = useForm<AddTeacherForm>({
        resolver: zodResolver(addTeacherSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleRemoveClick = (teacher: UserDto) => {
        setTeacherToRemove(teacher);
        open("confirmation");
    };

    const handleConfirmRemove = async () => {
        if (!teacherToRemove?.email) return;

        await removeTeacherFromCourse({
            courseId,
            email: teacherToRemove.email
        });
        setTeacherToRemove(null);
        close();
    };

    const onSubmit = async (values: AddTeacherForm) => {
        await addTeacherToCourse({
            courseId,
            email: values.email
        });
        form.reset();
        close();
    };

    return (
        <>
            <Dialog open={isOpen("manageTeachersModal")} onOpenChange={(open) => !open && close()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t("manageTeachers.title")} {courseName}
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="current">
                                {t("manageTeachers.current")}
                            </TabsTrigger>
                            <TabsTrigger value="add">
                                {t("manageTeachers.add")}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="current" className="space-y-4">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : !teachers || teachers.length === 0 ? (
                                <div className="text-center text-muted-foreground py-4">
                                    {t("manageTeachers.noTeachers")}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {teachers.map((teacher) => (
                                        <div
                                            key={teacher.id}
                                            className="flex items-center justify-between p-2 border rounded-lg"
                                        >
                                            <div className="flex flex-col">
                                                <Badge variant="secondary">
                                                    {teacher.firstName && teacher.lastName
                                                        ? `${teacher.firstName} ${teacher.lastName}`
                                                        : teacher.userName || teacher.email}
                                                </Badge>
                                                {teacher.email && teacher.email !== teacher.userName && (
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {teacher.email}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveClick(teacher)}
                                            >
                                                <UserMinusIcon className="h-4 w-4 mr-2"/>
                                                {t("manageTeachers.remove")}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="add" className="space-y-4">
                            <Form {...form}>
                                <FormDescription>{t("requiredFieldDescription")}</FormDescription>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{t("manageTeachers.addTeacher.email")}*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="teacher@example.com" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    {t("manageTeachers.addTeacher.description")}
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-between">
                        <Button variant="secondary" onClick={() => close()}>
                            <XCircleIcon className="h-4 w-4 mr-2"/>
                            {t("cancel")}
                        </Button>
                        {activeTab === "add" && (
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={!form.formState.isValid}
                            >
                                <UserPlus className="h-4 w-4 mr-2"/>
                                {t("manageTeachers.add")}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {teacherToRemove && (
                <ConfirmationDialog
                    header={t("manageTeachers.delete.title")}
                    text={t("manageTeachers.delete.description")}
                    onConfirm={handleConfirmRemove}
                />
            )}
        </>
    );
}