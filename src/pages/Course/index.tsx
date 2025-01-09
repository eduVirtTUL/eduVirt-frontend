import { Button } from "@/components/ui/button";
import { useCourse } from "@/data/course/useCourse";
import { useCourseResourceGroupPools } from "@/data/rgPool/useCourseResourceGroupPools";

import { useDialog } from "@/stores/dialogStore";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  Info,
  MoreHorizontal,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseTeams } from "@/data/team/useCoursesTeams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
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
import { TeamDto } from "@/api";
import CreatePoolModal from "@/components/Modals/CreatePoolModal";
import AddCourseKeyDialog from "@/components/Modals/AddCourseKeyModal";
import PageHeader from "@/components/PageHeader";
import { Link } from "react-router";
import CreateTeamModal from "@/components/Modals/CreateTeamModal";
import DataTable from "@/components/DataTable";
import StatefulPodDrawer from "./StatefulPodDrawer";
import { EditTeamModal } from "@/components/Modals/EditTeamModal";
import { SoloTeamEditModal } from "@/components/Modals/SoloTeamEditModal";
import ResourceGroupPoolCard from "./ResourceGroupPoolCard";
import StatefullResourceGroups from "./StatefullResourceGroups";
import { useTranslation } from "react-i18next";

const CoursePage: React.FC<Route.ComponentProps> = ({ params: { id } }) => {
  const { t } = useTranslation();
  const { course } = useCourse(id);
  const { open } = useDialog();
  const { courseResourceGroupPools } = useCourseResourceGroupPools(id);
  const { teams, isLoading } = useCourseTeams(id!);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamDto | null>(null);
  const [manageStatefulPodsOpen, setManageStatefulPodsOpen] = useState(false);
  const [manageStatelessPodsOpen, setManageStatelessPodsOpen] = useState(false);
  const isTeamBased = course?.courseType === "TEAM_BASED";
  const { course: courseAccessKey, isLoading: isCourseAccessKeyLoading } =
    useCourseAccessKey(id, {
      enabled: !isTeamBased,
    });

  const teamQueries = useTeamsInCourseAccessKeys(
    teams?.map((team) => team.id!) ?? [],
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
          Name
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
      header: "Members",
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
                    No members
                  </div>
                ) : (
                  users.map((user: string) => (
                    <div key={user}>
                      <Badge variant="outline">{user}</Badge>
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
      header: "Max Size",
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
            header: "Team Access Key",
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
                      toast.success("Team key copied to clipboard");
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
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <StatusDot active={row.original.active} />
          <span className="ml-2">
            {row.original.active ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEditingTeam(row.original)}>
              Edit Team
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTeamId(row.original.id);
                setManageStatefulPodsOpen(true);
              }}
            >
              Manage Stateful Pods
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTeamId(row.original.id);
                setManageStatelessPodsOpen(true);
              }}
            >
              Manage Stateless Pods
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <CreatePoolModal courseId={id} />
      <AddCourseKeyDialog courseId={id} />
      <PageHeader title={course?.name ?? ""} type={t("coursePage.title")} />
      <div className="space-y-6">
        <div className="flex space-x-4">
          <Card className="w-1/2">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{t("coursePage.settings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-2">
                <Button asChild>
                  <Link to={`limits`}>{t("coursePage.limits")}</Link>
                </Button>
                <Button variant="secondary">
                  <PencilIcon />
                  {t("coursePage.edit")}
                </Button>
                <Button variant="destructive">
                  <TrashIcon />
                  {t("coursePage.delete")}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className={isTeamBased ? "w-1/2" : "w-1/4"}>
            <CardHeader>
              <CardTitle>Course Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={isTeamBased ? "default" : "secondary"}>
                  {isTeamBased ? "Team Based" : "Solo"}
                </Badge>
                <Popover>
                  <PopoverTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      {isTeamBased
                        ? "Team-based courses allow students to work together in groups, sharing resources and collaborating on assignments."
                        : "Solo courses are designed for individual work, where each student works independently with their own resources."}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
          {!isTeamBased && (
            <Card className="w-1/4">
              <CardHeader>
                <CardTitle>Course Access Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          "Access key has been copied to clipboard"
                        );
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <Button onClick={() => open("createCourseKey")}>
                      Create Key
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <StatefullResourceGroups courseId={id} />
        <Card>
          <CardHeader>
            <CardTitle>{t("coursePools.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => open("createPool")} className="mb-4">
              <PlusIcon />
              {t("coursePools.createPool")}
            </Button>
            <div className="grid grid-cols-4 gap-6">
              {courseResourceGroupPools?.map((pool) => (
                <ResourceGroupPoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Teams</CardTitle>
              {isTeamBased && <CreateTeamModal courseId={id!} />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="[&_.inactive-row]:opacity-60">
              {!isLoading && teams && (
                <DataTable columns={columns} data={teams} />
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
                users: editingTeam.users ?? [],
              }}
              existingNames={
                teams
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
      </div>
    </>
  );
};

export default CoursePage;
