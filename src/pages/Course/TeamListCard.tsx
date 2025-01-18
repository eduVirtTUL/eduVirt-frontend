import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {TeamDto, UserDto} from "@/api";
import {useTranslation} from "react-i18next";
import DataTable from "@/components/DataTable";
import {ColumnDef, Row} from "@tanstack/react-table";
import {
    ArrowUpDown, CalendarIcon,
    Copy,
    FileCheck2,
    FileX2,
    Info,
    MoreHorizontal,
    PencilIcon,
    SmilePlus,
    TrashIcon,
    XIcon,
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Skeleton} from "@/components/ui/skeleton";
import {StatusDot} from "@/components/StatusDot";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {toast} from "sonner";
import {useDialog} from "@/stores/dialogStore";
import {Input} from "@/components/ui/input";
import {useDebounce} from "use-debounce";
import React, {useMemo, useState} from "react";
import {EditTeamModal} from "@/components/Modals/EditTeamModal";
import {SoloTeamEditModal} from "@/components/Modals/SoloTeamEditModal";
import {ManageTeamUsersModal} from "@/components/Modals/ManageTeamUsersModal";
import {ManageSoloCourseUsersModal} from "@/components/Modals/ManageSoloCoursesTeamModal";
import {useDeleteTeam} from "@/data/team/useDeleteTeam";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import StatefulPodDrawer from "./StatefulPodDrawer";
import StatelessPodDrawer from "./StatelessPodDrawer";
import {Link} from "react-router";

interface TeamsTableProps {
    isTeamBased: boolean;
    teams?: { items: TeamDto[]; page?: { totalPages: number } };
    isLoading: boolean;
    teamQueries: { isLoading: boolean; data?: { id: string; key?: { keyValue: string } } }[];
    pageNumber: number;
    setPageNumber: (page: number) => void;
    courseId: string;
    courseName: string;
}

const TeamListCard: React.FC<TeamsTableProps> = ({
    isTeamBased,
    teams,
    isLoading,
    teamQueries,
    pageNumber,
    setPageNumber,
    courseId,
    courseName,
}) => {
    const {t} = useTranslation();
    const {open} = useDialog();
    const {deleteTeam} = useDeleteTeam();

    const [search, setSearch] = React.useState("");
    const [searchValue] = useDebounce(search, 500);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [editingTeam, setEditingTeam] = useState<TeamDto | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<TeamDto | null>(null);
    const [selectedTeamForUsers, setSelectedTeamForUsers] = useState<TeamDto | null>(null);
    const [manageStatefulPodsOpen, setManageStatefulPodsOpen] = useState(false);
    const [manageStatelessPodsOpen, setManageStatelessPodsOpen] = useState(false);

    const handleDeleteTeam = async () => {
        if (teamToDelete?.id) {
            await deleteTeam(teamToDelete.id);
            setTeamToDelete(null);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<any, any>[] = [
        {
            accessorKey: "name",
            header: ({column}) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                
                if (!isTeamBased) {
                    const user = users[0];
                    return user ? (
                        <div className="flex flex-col">
                            <span>
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.userName || user.email}
                            </span>
                            {user.email && user.email !== user.userName && (
                                <span className="text-xs text-muted-foreground mt-1">
                                    {user.email}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">
                            {t("coursePageB.teamsTable.columns.noMembers")}
                        </span>
                    );
                }

                return (
                    <Popover>
                        <PopoverTrigger>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <span>{users.length}</span>
                                <Info className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="space-y-2">
                                {users.length === 0 ? (
                                    <div className="text-muted-foreground text-center">
                                        {t("coursePageB.teamsTable.columns.noMembers")}
                                    </div>
                                ) : (
                                    users.map((user: UserDto) => (
                                        <div key={user.id}>
                                            <Badge variant="secondary">
                                                {user.firstName && user.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : user.userName || user.email}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
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
                    //@ts-expect-error this doesn't impact the page
                    cell: ({row}) => {
                        const teamId = row.original.id;
                        const query = teamQueries.find((q) => q.data?.id === teamId);

                        if (query?.isLoading) {
                            return <Skeleton className="h-4 w-20"/>;
                        }

                        return (
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {query?.data?.key?.keyValue}
                                </Badge>
                                <Copy
                                    className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            query?.data?.key?.keyValue || ""
                                        );
                                        toast.success(
                                            t("coursePageB.teamsTable.columns.accessKey.copied")
                                        );
                                    }}
                                />
                            </div>
                        );
                    },
                },
            ]
            : []),
        {
            accessorKey: "active",
            header: t("coursePageB.teamsTable.columns.status"),
            cell: ({row}) => (
                <div className="flex items-center">
                    <StatusDot active={row.original.active}/>
                    <span className="ml-2">
            {row.original.active
                ? t("activeStatus.active")
                : t("activeStatus.inactive")}
          </span>
                </div>
            ),
        },
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
                        <DropdownMenuItem onClick={() => setEditingTeam(row.original)}>
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            {t("coursePageB.teamsTable.dropdownMenu.editTeam")}
                        </DropdownMenuItem>
                        {isTeamBased && (
                            <DropdownMenuItem onClick={() => {
                                setSelectedTeamForUsers(row.original);
                                open("manageTeamUsers");
                            }}>
                                <SmilePlus className="h-4 w-4 mr-2"/>
                                {t("coursePageB.teamsTable.dropdownMenu.manageUsers")}
                            </DropdownMenuItem>
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
                        <DropdownMenuItem>
                            <Link to={`/reservations/teams/${row.original.id}`}>
                                <DropdownMenuItem>
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    {t("coursePageB.teamsTable.dropdownMenu.reservations")}
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuItem>
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

    const filteredTeams = useMemo(() => {
        if (!teams?.items || !searchValue) return teams?.items;
        
        return teams.items.filter(team => 
            team.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            team.users?.some(user => 
                (user.userName || user.email || '')
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            )
        );
    }, [teams?.items, searchValue]);

    return (
        <>
            <Card>
                <CardHeader/>
                <CardContent>
                    <div className="flex flex-row gap-2 mb-5">
                        <Input
                            placeholder={t("teamsList.searchPlaceholder")}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                setSearch("");
                            }}
                        >
                            <XIcon/>
                            {t("teamsList.clear")}
                        </Button>
                    </div>
                    <div className="[&_.inactive-row]:opacity-60">
                        {!isLoading && teams && (
                            <>
                                <DataTable columns={columns} data={filteredTeams ?? []}/>
                                {filteredTeams?.length !== 0 && (
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
                                                {(teams?.page?.totalPages ?? 0) > pageNumber + 1 && (
                                                    <PaginationItem>
                                                        <PaginationLink
                                                            onClick={() => setPageNumber(pageNumber + 1)}
                                                        >
                                                            {pageNumber + 2}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )}
                                                {teams?.page?.totalPages !== pageNumber + 1 && (
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

            {editingTeam && editingTeam.id && (
                isTeamBased ? (
                    <EditTeamModal
                        open={!!editingTeam}
                        onOpenChange={(open) => !open && setEditingTeam(null)}
                        team={{
                            id: editingTeam.id,
                            name: editingTeam.name ?? "",
                            maxSize: editingTeam.maxSize ?? 0,
                            active: editingTeam.active ?? false,
                            users: (editingTeam.users ?? []).map(user => ({
                                id: user.id!,
                                name: user.userName || user.email || ''
                            })),
                        }}
                        existingNames={
                            teams?.items
                                ?.filter((t) => t.id !== editingTeam.id)
                                .map((t) => t.name)
                                .filter((name): name is string => name !== undefined) ?? []
                        }
                    />
                ) : (
                    <SoloTeamEditModal
                        open={!!editingTeam}
                        onOpenChange={(open) => !open && setEditingTeam(null)}
                        team={{
                            id: editingTeam.id,
                            active: editingTeam.active ?? false,
                        }}
                    />
                )
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
        </>
    );
};

export default TeamListCard;
