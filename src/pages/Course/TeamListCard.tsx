import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {TeamAccessKeyDto, TeamDto, TeamWithKeyDto, UserDto} from "@/api";
import {useTranslation} from "react-i18next";
import DataTable from "@/components/DataTable";
import {ColumnDef, Row} from "@tanstack/react-table";
import {
    ArrowUpDown,
    CalendarIcon,
    Copy,
    FileCheck2,
    FileX2,
    MoreHorizontal,
    PencilIcon,
    SmilePlus,
    TrashIcon,
    UserMinusIcon,
    XIcon,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {useDialog} from "@/stores/dialogStore";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {EditTeamModal} from "@/components/Modals/EditTeamModal";
import {ManageTeamUsersModal} from "@/components/Modals/ManageTeamUsersModal";
import {ManageSoloCourseUsersModal} from "@/components/Modals/ManageSoloCoursesTeamModal";
import {useDeleteTeam} from "@/data/team/useDeleteTeam";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import StatefulPodDrawer from "./StatefulPodDrawer";
import StatelessPodDrawer from "./StatelessPodDrawer";
import {useNavigate} from "react-router";
import {toast} from "sonner";
import {useTeam} from "@/data/team/useTeam";
import {SearchType} from "@/data/team/useCoursesTeams";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRemoveStudentFromCourse} from "@/data/team/users/useRemoveStudentFromCourse";

interface TeamsTableProps {
    isTeamBased: boolean;
    teams?: TeamWithKeyDto[];
    totalPages?: number;
    isLoading: boolean;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    courseId: string;
    courseName: string;
    search: string;
    setSearch: (search: string) => void;
    searchType: SearchType;
    setSearchType: (type: SearchType) => void;
    sortOrder: "ASC" | "DESC";
    setSortOrder: (order: "ASC" | "DESC") => void;
    emailPrefixes?: string[];
    onRemoveEmailPrefix?: (email: string) => void;
}

const TableSkeleton = () => (
    <div className="space-y-3">
        <div className="flex items-center space-x-4 py-4">
            <div className="h-4 w-[30%] bg-muted animate-pulse rounded"/>
            <div className="h-4 w-[40%] bg-muted animate-pulse rounded"/>
            <div className="h-4 w-[20%] bg-muted animate-pulse rounded"/>
        </div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4">
                <div className="h-4 w-[25%] bg-muted animate-pulse rounded"/>
                <div className="h-4 w-[45%] bg-muted animate-pulse rounded"/>
                <div className="h-4 w-[15%] bg-muted animate-pulse rounded"/>
                <div className="h-4 w-[10%] bg-muted animate-pulse rounded"/>
            </div>
        ))}
    </div>
);

const TeamListCard: React.FC<TeamsTableProps> = ({
                                                     isTeamBased,
                                                     teams,
                                                     totalPages,
                                                     isLoading,
                                                     pageNumber,
                                                     setPageNumber,
                                                     courseId,
                                                     courseName,
                                                     search,
                                                     setSearch,
                                                     searchType,
                                                     setSearchType,
                                                     sortOrder,
                                                     setSortOrder,
                                                     emailPrefixes,
                                                     onRemoveEmailPrefix,
                                                 }) => {
    const {t} = useTranslation();
    const {open} = useDialog();
    const {deleteTeam} = useDeleteTeam();

    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<TeamDto | null>(null);
    const [selectedTeamForUsers, setSelectedTeamForUsers] = useState<TeamDto | null>(null);
    const [manageStatefulPodsOpen, setManageStatefulPodsOpen] = useState(false);
    const [manageStatelessPodsOpen, setManageStatelessPodsOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteTeam = async () => {
        if (teamToDelete?.id) {
            await deleteTeam(teamToDelete.id);
            setTeamToDelete(null);
        }
    };

    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const {team: editingTeam, etag: editingTeamEtag} = useTeam(editingTeamId ?? '', {
        enabled: !!editingTeamId
    });

    const handleEditClick = (team: TeamDto) => {
        setEditingTeamId(team.id ?? null);
    };

    const [userToRemove, setUserToRemove] = useState<{ user: UserDto } | null>(null);
    const {removeStudentFromCourse} = useRemoveStudentFromCourse();

    const handleRemoveStudent = async () => {
        if (!userToRemove?.user.email) return;

        try {
            await removeStudentFromCourse({
                courseId,
                email: userToRemove.user.email
            });
            setUserToRemove(null);
        } catch (error) {
            console.error(error);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<any, any>[] = [
        {
            accessorKey: "name",
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() => setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")}
                    className="w-full justify-start pl-2"
                >
                    {t("coursePageB.teamsTable.columns.name")}
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
            cell: ({row}: { row: Row<TeamDto> }) => (
                <div className="flex items-center">
                    <span>{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "users",
            header: isTeamBased
                ? t("coursePageB.teamsTable.columns.members")
                : t("coursePageB.teamsTable.columns.member"),
            cell: ({row}: { row: Row<TeamDto> }) => {
                const users = row.original.users || [];

                if (users.length === 0) {
                    return (
                        <span className="text-muted-foreground">
                            {t("coursePageB.teamsTable.columns.noMembers")}
                        </span>
                    );
                }

                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {users.map((user: UserDto) => (
                            <div key={user.id} className="flex flex-col min-w-[150px]">
                                <span className="truncate">
                                    {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.userName || user.email}
                                </span>
                                {user.email && user.email !== user.userName && (
                                    <span className="text-xs text-muted-foreground mt-1 truncate">
                                        {user.email}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                );
            },
        },
        ...(isTeamBased ? [
            {
                accessorKey: "maxSize",
                header: t("coursePageB.teamsTable.columns.maxSize"),
                cell: ({row}: { row: Row<TeamDto> }) => (
                    <div className="flex items-center">
                        <Badge variant="secondary">{row.original.maxSize}</Badge>
                    </div>
                ),
            }
        ] : []),
        ...(isTeamBased
            ? [
                {
                    accessorKey: "keyValue",
                    header: t("coursePageB.teamsTable.columns.accessKey.label"),

                    cell: ({row}: { row: Row<TeamAccessKeyDto> }) => (
                        <div className="flex items-center gap-2">
                            <Badge variant="default">{row.original.keyValue}</Badge>
                            <Copy
                                className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        row.original.keyValue || ""
                                    );
                                    toast.success(
                                        t("coursePageB.teamsTable.columns.accessKey.copied")
                                    );
                                }}
                            />
                        </div>
                    ),
                },
            ]
            : []),
        {
            id: "actions",
            cell: ({row}) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {isTeamBased && (
                            <>
                                <DropdownMenuItem onClick={() => handleEditClick(row.original)}>
                                    <PencilIcon className="h-4 w-4 mr-2"/>
                                    {t("coursePageB.teamsTable.dropdownMenu.editTeam")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    setSelectedTeamForUsers(row.original);
                                    open("manageTeamUsers");
                                }}>
                                    <SmilePlus className="h-4 w-4 mr-2"/>
                                    {t("coursePageB.teamsTable.dropdownMenu.manageUsers")}
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedTeamId(row.original.id);
                                setManageStatefulPodsOpen(true);
                            }}
                        >
                            <FileCheck2 className="h-4 w-4 mr-2"/>
                            {t("coursePageB.teamsTable.dropdownMenu.manageStatefulPods")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedTeamId(row.original.id);
                                setManageStatelessPodsOpen(true);
                            }}
                        >
                            <FileX2 className="h-4 w-4 mr-2"/>
                            {t("coursePageB.teamsTable.dropdownMenu.manageStatelessPods")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(`/reservations/teams/${row.original.id}`)}
                        >
                            <CalendarIcon className="h-4 w-4 mr-2"/>
                            {t("coursePageB.teamsTable.dropdownMenu.reservations")}
                        </DropdownMenuItem>
                        {!isTeamBased && row.original.users?.[0] && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setUserToRemove({
                                        user: row.original.users[0],
                                    });
                                    open("confirmation");
                                }}
                                className="text-destructive"
                            >
                                <UserMinusIcon className="h-4 w-4 mr-2"/>
                                {t("coursePageB.teamsTable.dropdownMenu.removeStudent")}
                            </DropdownMenuItem>
                        )}
                        {isTeamBased && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setTeamToDelete(row.original);
                                    open("confirmation");
                                }}
                                className="text-destructive"
                            >
                                <TrashIcon className="h-4 w-4 mr-2"/>
                                {t("coursePageB.teamsTable.dropdownMenu.deleteTeam.button")}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Card>
                <CardHeader/>
                <CardContent>
                    {emailPrefixes && emailPrefixes.length > 0 ? (
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-2">
                                {t("teamsList.searchResults")}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {emailPrefixes.map(email => (
                                    <Badge key={email} variant="secondary">
                                        {email}
                                        {onRemoveEmailPrefix && (
                                            <XIcon
                                                className="ml-2 h-3 w-3 cursor-pointer"
                                                onClick={() => onRemoveEmailPrefix(email)}
                                            />
                                        )}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 mb-5">
                            <Select
                                value={searchType}
                                onValueChange={(value: SearchType) => setSearchType(value)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder={t("teamsList.searchType.placeholder")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEAM_NAME">{t("teamsList.searchType.teamName")}</SelectItem>
                                    <SelectItem
                                        value="STUDENT_NAME">{t("teamsList.searchType.studentName")}</SelectItem>
                                    <SelectItem
                                        value="STUDENT_EMAIL">{t("teamsList.searchType.studentEmail")}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder={t("teamsList.searchPlaceholder")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={() => setSearch("")}>
                                <XIcon/>
                                {t("teamsList.clear")}
                            </Button>
                        </div>
                    )}
                    <div className="[&_.inactive-row]:opacity-60">
                        {isLoading ? (
                            <TableSkeleton/>
                        ) : (
                            teams && (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={teams}
                                    />
                                    {teams.length > 0 && totalPages && totalPages > 1 && (
                                        <div className="mt-4">
                                            <Pagination>
                                                <PaginationContent>
                                                    {pageNumber > 0 && (
                                                        <>
                                                            <PaginationItem>
                                                                <PaginationPrevious
                                                                    onClick={() => setPageNumber(pageNumber - 1)}
                                                                />
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink
                                                                    onClick={() => setPageNumber(pageNumber - 1)}
                                                                >
                                                                    {pageNumber}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        </>
                                                    )}
                                                    <PaginationItem>
                                                        <PaginationLink isActive>
                                                            {pageNumber + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    {totalPages > pageNumber + 1 && (
                                                        <PaginationItem>
                                                            <PaginationLink
                                                                onClick={() => setPageNumber(pageNumber + 1)}
                                                            >
                                                                {pageNumber + 2}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )}
                                                    {totalPages !== pageNumber + 1 && (
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                onClick={() => setPageNumber(pageNumber + 1)}
                                                            />
                                                        </PaginationItem>
                                                    )}
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </CardContent>
            </Card>

            {selectedTeamId && manageStatefulPodsOpen && (
                <StatefulPodDrawer
                    open={manageStatefulPodsOpen}
                    onOpenChange={setManageStatefulPodsOpen}
                    teamId={selectedTeamId}
                />
            )}

            {selectedTeamId && manageStatelessPodsOpen && (
                <StatelessPodDrawer
                    open={manageStatelessPodsOpen}
                    onOpenChange={setManageStatelessPodsOpen}
                    teamId={selectedTeamId}
                    courseId={courseId}
                />
            )}
            {editingTeam && editingTeamId && editingTeamEtag && (
                <EditTeamModal
                    open={true}
                    onOpenChange={(open) => !open && setEditingTeamId(null)}
                    team={{
                        id: editingTeamId,
                        name: editingTeam.name ?? "",
                        maxSize: editingTeam.maxSize ?? 0,
                        etag: editingTeamEtag,
                        users: editingTeam.users?.map(user => ({
                            id: user.id!,
                            name: user.userName || user.email || ''
                        })) ?? []
                    }}
                    existingNames={teams
                        ?.filter(t => t.id !== editingTeamId)
                        .map(t => t.name!)
                        .filter(Boolean) ?? []}
                />
            )}

            {selectedTeamForUsers && (
                <ManageTeamUsersModal
                    team={{
                        id: selectedTeamForUsers.id!,
                        name: selectedTeamForUsers.name!,
                        users: selectedTeamForUsers.users ?? [],
                    }}
                />
            )}

            {!isTeamBased && (
                <ManageSoloCourseUsersModal
                    courseId={courseId}
                    courseName={courseName}
                />
            )}

            {teamToDelete && (
                <ConfirmationDialog
                    header={t("coursePageB.teamsTable.dropdownMenu.deleteTeam.confirmation.title")}
                    text={t("coursePageB.teamsTable.dropdownMenu.deleteTeam.confirmation.description", {team: teamToDelete.name})}
                    onConfirm={handleDeleteTeam}
                />
            )}

            {userToRemove && (
                <ConfirmationDialog
                    header={t("manageCourseUsers.delete.title")}
                    text={t("manageCourseUsers.delete.description")}
                    onConfirm={handleRemoveStudent}
                />
            )}
        </>
    );
};

export default TeamListCard;
