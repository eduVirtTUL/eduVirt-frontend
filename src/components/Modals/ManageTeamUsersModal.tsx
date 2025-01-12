import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRemoveUserFromTeam } from "@/data/team/useRemoveUserFromTeam";
import { XCircleIcon, UserMinusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDialog } from "@/stores/dialogStore";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { UserDto } from "@/api";

interface ManageTeamUsersModalProps {
    team: {
        id: string;
        name: string;
        users: UserDto[];  // Changed from string[] to UserDto[]
    };
}

export function ManageTeamUsersModal({ team }: ManageTeamUsersModalProps) {
    const { isOpen, close, open } = useDialog();
    const { t } = useTranslation();
    const { removeUser } = useRemoveUserFromTeam(team.id);
    const [activeTab, setActiveTab] = useState("current");
    const [isRemoving, setIsRemoving] = useState<string | null>(null);
    const [userToRemove, setUserToRemove] = useState<UserDto | null>(null);

    const handleRemoveClick = (user: UserDto) => {
        setUserToRemove(user);
        open("confirmation");
    };

    const handleConfirmRemove = async () => {
        if (!userToRemove || !userToRemove.id) return;
        
        setIsRemoving(userToRemove.id);
        try {
            await removeUser(userToRemove.id);
            close();
        } catch (error) {
            console.error(error);
        } finally {
            setIsRemoving(null);
            setUserToRemove(null);
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
                            <div className="text-center text-muted-foreground py-4">
                                {/* {t("manageTeamUsers.addUserFeature")} */}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex">
                        <Button variant="secondary" onClick={() => close()}>
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            {t("cancel")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {userToRemove && (
                <ConfirmationDialog
                    header={`${t("manageTeamUsers.delete.title")} ${
                        userToRemove.firstName && userToRemove.lastName 
                            ? `${userToRemove.firstName} ${userToRemove.lastName}`
                            : userToRemove.userName || userToRemove.email
                    }? ${t("manageTeamUsers.delete.title2")} ${team.name}`}
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
