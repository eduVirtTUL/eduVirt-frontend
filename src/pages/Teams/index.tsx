import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUsersTeams } from "@/data/team/useUsersTeams";
import { StatusDot } from "@/components/StatusDot";
import JoinTeamModal from "@/components/Modals/JoinTeamModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface TeamWithCourseDto {
  id: string;
  name: string;
  active: boolean;
  maxSize: number;
  users: string[];
  course: {
    id: string;
    name: string;
    description: string;
    courseType: string;
  };
}

const TeamsPage = () => {
  const { t } = useTranslation();
  const { teams, isLoading } = useUsersTeams();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <div className="border-b">
            <div className="grid grid-cols-4 p-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-[100px]" />
              ))}
            </div>
          </div>
          <div>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="grid grid-cols-4 p-4 border-b">
                {[1, 2, 3, 4].map((col) => (
                  <Skeleton key={col} className="h-4 w-[100px]" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const columns: ColumnDef<TeamWithCourseDto>[] = [
    {
      accessorKey: "active",
      header: t('teamsList.table.columns.status'),
      cell: ({ row }) => (
        <div className="flex items-center">
          <StatusDot active={row.original.active} />
          <span className="ml-2">
            {row.original.active ? t('activeStatus.active') : t('activeStatus.inactive')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start pl-2"
        >
          {t('teamsList.table.columns.name')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "course.name",
      header: t('teamsList.table.columns.course'),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Link
            to={`/teams/${row.original.id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">{t("teamsList.viewDetails")}</span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title={t('teamsList.title')} />
        <div className="pb-10">
          <JoinTeamModal />
        </div>
      </div>
      <div className="[&_.inactive-row]:opacity-60">
        {/* @ts-expect-error this doesn't impact the page */}
        <DataTable columns={columns} data={teams ?? []} />
      </div>
    </div>
  );
};

export default TeamsPage;