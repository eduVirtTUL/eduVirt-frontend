import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddStudentToTeam } from "@/data/team/users/useAddStudentToTeam";
import { useRemoveStudentFromTeam } from "@/data/team/users/useRemoveStudentFromTeam";
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

interface ManageTeamUsersModalProps {
    team: {
        id: string;
        name: string;
        users: UserDto[]; 
    };
}

const addUserSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type AddUserForm = z.infer<typeof addUserSchema>;

export function ManageTeamUsersModal({ team }: ManageTeamUsersModalProps) {
    const { isOpen, close, open } = useDialog();
    const { t } = useTranslation();
    const { removeStudentFromTeam } = useRemoveStudentFromTeam();
    const { addStudentToTeam } = useAddStudentToTeam();
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
        if (!userToRemove || !userToRemove.id) return;
        
        setIsRemoving(userToRemove.id);
        try {
            await removeStudentFromTeam({ teamId: team.id, email: userToRemove.email? userToRemove.email : "" });
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
            await addStudentToTeam({ teamId: team.id, email: values.email });
            form.reset();
            close();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Dialog open={isOpen("manageTeamUsers")} onOpenChange={(open) => !open && close()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t("manageTeamUsers.title")} {team.name}
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="current">
                                {t("manageTeamUsers.remove")}
                            </TabsTrigger>
                            <TabsTrigger value="add">
                                {t("manageTeamUsers.add")}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="current" className="space-y-4">
                            {team.users.length === 0 ? (
                                <div className="text-center text-muted-foreground py-4">
                                    {t("manageTeamUsers.noUsers")}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {team.users.map((user) => (
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
                                                {t("manageTeamUsers.remove")}
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
                                                <FormLabel>{t("manageTeamUsers.addUser.email")}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="user@example.com" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    {t("manageTeamUsers.addUser.description")}
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
                                {t("manageTeamUsers.add")}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {userToRemove && (
                <ConfirmationDialog
                    header={`${t("manageTeamUsers.delete.title")} ${
                        userToRemove.firstName && userToRemove.lastName 
                            ? `${userToRemove.firstName} ${userToRemove.lastName}`
                            : userToRemove.userName || userToRemove.email
                    } ${t("manageTeamUsers.delete.title2")} ${team.name}`}
                    text={t("manageTeamUsers.delete.description", {
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
