import { Button } from "@/components/ui/button";
import { useCourse } from "@/data/course/useCourse";
import { useCourseResourceGroupPools } from "@/data/rgPool/useCourseResourceGroupPools";

import { useDialog } from "@/stores/dialogStore";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChartCandlestickIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  ExternalLinkIcon,
  FileCheck2,
  FileX2,
  Info,
  MoreHorizontal,
  PencilIcon,
  PlusIcon,
  RefreshCcw,
  SmilePlus,
  Trash2Icon,
  TrashIcon,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseTeams } from "@/data/team/useCoursesTeams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { Route } from "./+types/index";
import { useCourseAccessKey } from "@/data/access-key/useCourseAccessKey";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import StatelessPodDrawer from "./StatelessPodDrawer";
import { useTeamsInCourseAccessKeys } from "@/data/access-key/useTeamsInCourseAccessKeys";
import { StatusDot } from "@/components/StatusDot";
import { TeamDto, UserDto } from "@/api";
import CreatePoolModal from "@/components/Modals/CreatePoolModal";
import CreateCourseKeyModal from "@/components/Modals/CreateCourseKeyModal";
import PageHeader from "@/components/PageHeader";
import { Link } from "react-router";
import CreateTeamModal from "@/components/Modals/CreateTeamModal";
import DataTable from "@/components/DataTable";
import StatefulPodDrawer from "./StatefulPodDrawer";
import { EditTeamModal } from "@/components/Modals/EditTeamModal";
import { SoloTeamEditModal } from "@/components/Modals/SoloTeamEditModal";
import ResourceGroupPoolCard from "./ResourceGroupPoolCard";
import StatefulResourceGroups from "./StatefulResourceGroups";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useDeleteCourse } from "@/data/course/useDeleteCourse";
import EditCourseModal from "@/components/Modals/EditCourseModal";
import { useResetCourse } from "@/data/course/useResetCourse";
import ValueDisplay from "@/components/ValueDisplay";
import { RouteHandle } from "@/AuthGuard";
import { t } from "i18next";
import { ManageTeamUsersModal } from "@/components/Modals/ManageTeamUsersModal";
import { ManageSoloCourseUsersModal } from "@/components/Modals/ManageSoloCoursesTeamModal";
import { useDeleteTeam } from "@/data/team/useDeleteTeam";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import TeachersList from "@/components/TeachersList";
import { ManageTeachersModal } from "@/components/Modals/ManageTeachersModal";
import { useUser } from "@/stores/userStore";

const CoursePage: React.FC<Route.ComponentProps> = ({ params: { id } }) => {
  const { t } = useTranslation();
  const { course } = useCourse(id);
  const { open } = useDialog();
  const { courseResourceGroupPools } = useCourseResourceGroupPools(id);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 4;
  const { teams, isLoading } = useCourseTeams(id, pageNumber, pageSize);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamDto | null>(null);
  const [manageStatefulPodsOpen, setManageStatefulPodsOpen] = useState(false);
  const [manageStatelessPodsOpen, setManageStatelessPodsOpen] = useState(false);
  const [selectedTeamForUsers, setSelectedTeamForUsers] =
    useState<TeamDto | null>(null);
  const isTeamBased = course?.courseType === "TEAM_BASED";
  const { course: courseAccessKey, isLoading: isCourseAccessKeyLoading } =
    useCourseAccessKey(id, {
      enabled: !isTeamBased,
    });
  const { deleteCourseAsync } = useDeleteCourse();
  const { resetCourseAsync } = useResetCourse();

  const [teamToDelete, setTeamToDelete] = useState<TeamDto | null>(null);
  const { deleteTeam } = useDeleteTeam();
  const { activeRole } = useUser();

  const [isTeachersOpen, setIsTeachersOpen] = useState(() => {
    const saved = localStorage.getItem(`courseTeachersCollapsible-${id}`);
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(
      `courseTeachersCollapsible-${id}`,
      JSON.stringify(isTeachersOpen)
    );
  }, [isTeachersOpen, id]);

  const handleDeleteTeam = async () => {
    if (teamToDelete?.id) {
      await deleteTeam(teamToDelete.id);
      setTeamToDelete(null);
    }
  };

  const teamQueries = useTeamsInCourseAccessKeys(
    teams?.items.map((team) => team.id!) ?? [],
    isTeamBased
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start pl-2"
        >
          {t("coursePageB.teamsTable.columns.name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "users",
      header: t("coursePageB.teamsTable.columns.members"),
      cell: ({ row }) => {
        const users = row.original.users || [];
        return (
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <span>{users.length}</span>
                <Info className="h-4 w-4 text-muted-foreground" />
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
    {
      accessorKey: "maxSize",
      header: t("coursePageB.teamsTable.columns.maxSize"),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Badge variant="secondary">{row.original.maxSize}</Badge>
        </div>
      ),
    },
    ...(isTeamBased
      ? [
          {
            accessorKey: "keyValue",
            header: t("coursePageB.teamsTable.columns.accessKey.label"),
            //@ts-expect-error this doesn't impact the page
            cell: ({ row }) => {
              const teamId = row.original.id;
              const query = teamQueries.find((q) => q.data?.id === teamId);

              if (query?.isLoading) {
                return <Skeleton className="h-4 w-20" />;
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
      cell: ({ row }) => (
        <div className="flex items-center">
          <StatusDot active={row.original.active} />
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
      header: t("coursePageB.teamsTable.columns.operations"),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEditingTeam(row.original)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              {t("coursePageB.teamsTable.dropdownMenu.editTeam")}
            </DropdownMenuItem>
            {isTeamBased && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTeamForUsers(row.original);
                  open("manageTeamUsers");
                }}
              >
                <SmilePlus className="h-4 w-4 mr-2" />
                {t("coursePageB.teamsTable.dropdownMenu.manageUsers")}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setSelectedTeamId(row.original.id);
                setManageStatefulPodsOpen(true);
              }}
            >
              <FileCheck2 className="h-4 w-4 mr-2" />
              {t("coursePageB.teamsTable.dropdownMenu.manageStatefulPods")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTeamId(row.original.id);
                setManageStatelessPodsOpen(true);
              }}
            >
              <FileX2 className="h-4 w-4 mr-2" />
              {t("coursePageB.teamsTable.dropdownMenu.manageStatelessPods")}
            </DropdownMenuItem>
            {isTeamBased && (
              <DropdownMenuItem
                onClick={() => {
                  setTeamToDelete(row.original);
                  open("confirmation");
                }}
                className="text-destructive"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
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
      <EditCourseModal id={id} />
      <ConfirmationDialog
        header={t("coursePage.deleteAction.confirmation")}
        text={t("coursePage.deleteAction.confirmationText")}
        onConfirm={() => {
          deleteCourseAsync(id);
        }}
      />
      <ConfirmationDialog
        header={t("coursePage.resetAction.confirmation")}
        text={t("coursePage.resetAction.confirmationText")}
        onConfirm={() => {
          resetCourseAsync(id);
        }}
        name="resetCourseConfirmation"
      />
      <CreatePoolModal courseId={id} />
      <CreateCourseKeyModal courseId={id} />
      <PageHeader title={course?.name ?? ""} type={t("coursePage.title")} />
      <div className="flex flex-row gap-2 justify-end mb-5">
        {activeRole === "administrator" && (
          <Button asChild>
            <Link to={`limits`}>
              <ChartCandlestickIcon />
              {t("coursePage.limits")}
            </Link>
          </Button>
        )}
        <Button variant="secondary" onClick={() => open("editCourse")}>
          <PencilIcon />
          {t("coursePage.edit")}
        </Button>
        {activeRole === "administrator" && (
          <>
            <Button
              variant="destructive"
              onClick={() => open("resetCourseConfirmation")}
            >
              <RefreshCcw />
              {t("coursePage.reset")}
            </Button>
            <Button variant="destructive" onClick={() => open("confirmation")}>
              <Trash2Icon />
              {t("coursePage.delete")}
            </Button>
          </>
        )}
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{t("coursePage.details")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ValueDisplay
                className="col-span-2"
                label={t("coursePage.description")}
                value={course?.description ?? "-"}
              />
              <ValueDisplay
                className="col-span-2"
                label={t("coursePage.externalLink")}
                value={
                  course?.externalLink ? (
                    <Link
                      to={course.externalLink}
                      className="flex flex-row items-center gap-2"
                      target="_blank"
                    >
                      {course.externalLink}
                      <ExternalLinkIcon className="w-4 h-4" />
                    </Link>
                  ) : (
                    "-"
                  )
                }
              />
              <ValueDisplay
                label={t("coursePageB.courseTypeCard.title")}
                value={
                  <div className="flex items-center gap-2">
                    <Badge variant={isTeamBased ? "default" : "secondary"}>
                      {isTeamBased
                        ? t("courseType.teamBased")
                        : t("courseType.solo")}
                    </Badge>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80" side="right">
                        <p className="text-sm">
                          {isTeamBased
                            ? t("courseType.teamBasedDescription")
                            : t("courseType.soloDescription")}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                }
              />
              {!isTeamBased && (
                <ValueDisplay
                  label={t("coursePageB.courseAccessKeyCard.title")}
                  value={
                    <>
                      {isCourseAccessKeyLoading ? (
                        <Skeleton className="h-8 w-full" />
                      ) : courseAccessKey?.keyValue ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">
                            {courseAccessKey.keyValue}
                          </Badge>
                          <Copy
                            className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                courseAccessKey.keyValue || ""
                              );
                              toast.success(
                                t(
                                  "coursePageB.courseAccessKeyCard.keyCopiedToast"
                                )
                              );
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <Button onClick={() => open("createCourseKey")}>
                            <PlusIcon />
                            {t("coursePageB.courseAccessKeyCard.button")}
                          </Button>
                        </>
                      )}
                    </>
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col space-y-4">
          <Collapsible open={isTeachersOpen} onOpenChange={setIsTeachersOpen}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("coursePageB.teachersCard.title")}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => open("manageTeachers")}
                    >
                      <UserCog className="h-4 w-4 mr-2" />
                      {t("coursePageB.teachersCard.manageTeachers")}
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {isTeachersOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <TeachersList courseId={id} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
        <StatefulResourceGroups courseId={id} clusterId={course?.clusterId ?? ''} />
        <Card>
          <CardHeader>
            <CardTitle>{t("coursePools.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeRole === "teacher" && (
              <Button onClick={() => open("createPool")} className="mb-4">
                <PlusIcon />
                {t("coursePools.createPool")}
              </Button>
            )}

            <div className="grid grid-cols-4 gap-6">
              {courseResourceGroupPools?.map((pool) => (
                <ResourceGroupPoolCard
                  key={pool.id}
                  pool={pool}
                  courseId={course?.id ?? ''}
                  clusterId={course?.clusterId ?? ''}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("coursePageB.teamsTable.title")}</CardTitle>
              {isTeamBased ? (
                <CreateTeamModal courseId={id!} />
              ) : (
                <Button
                  variant="outline"
                  onClick={() => open("manageCourseUsers")}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  {t("coursePageB.teamsTable.students")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="[&_.inactive-row]:opacity-60">
              {!isLoading && teams && (
                <>
                  <DataTable columns={columns} data={teams.items ?? []} />
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        {pageNumber > 0 && (
                          <PaginationItem>
                            <Button
                              variant="ghost"
                              onClick={() => setPageNumber(pageNumber - 1)}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </PaginationItem>
                        )}

                        {pageNumber > 0 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setPageNumber(pageNumber - 1)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
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
                        {(teams?.page?.totalPages ?? 0) > pageNumber + 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        {(teams?.page?.totalPages ?? 0) > pageNumber + 1 && (
                          <PaginationItem>
                            <Button
                              variant="ghost"
                              onClick={() => setPageNumber(pageNumber + 1)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
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
            courseId={id}
          />
        )}
        {editingTeam &&
          editingTeam.id &&
          (isTeamBased ? (
            <EditTeamModal
              open={!!editingTeam}
              onOpenChange={(open) => !open && setEditingTeam(null)}
              team={{
                id: editingTeam.id,
                name: editingTeam.name ?? "",
                maxSize: editingTeam.maxSize ?? 0,
                active: editingTeam.active ?? false,
                users: (editingTeam.users ?? []).map((user) => ({
                  id: user.id!,
                  name: user.userName || user.email || "",
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
          ))}
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
            courseId={id}
            courseName={course?.name ?? ""}
          />
        )}
        {teamToDelete && (
          <ConfirmationDialog
            header={t(
              "coursePageB.teamsTable.dropdownMenu.deleteTeam.confirmation.title"
            )}
            text={t(
              "coursePageB.teamsTable.dropdownMenu.deleteTeam.confirmation.description",
              { team: teamToDelete.name }
            )}
            onConfirm={handleDeleteTeam}
          />
        )}
        <ManageTeachersModal courseId={id} courseName={course?.name ?? ""} />
      </div>
    </>
  );
};

export default CoursePage;

export const handle: RouteHandle = {
  roles: ["administrator", "teacher"],
};

export const meta = () => {
  return [{ title: t("pageTitles.course") }];
};
