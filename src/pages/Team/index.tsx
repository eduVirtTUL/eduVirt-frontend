import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, LoaderIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUsersTeams } from "@/data/team/useUsersTeams";
import { StatusDot } from "@/components/StatusDot";
import JoinTeamDialog from "@/pages/Team/join-team-dialog";

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
  const { teams, isLoading } = useUsersTeams();
  console.log(teams);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  const columns: ColumnDef<TeamWithCourseDto>[] = [
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
    },
    {
      accessorKey: "course.name",
      header: "Course",
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
            <span className="sr-only">View details</span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Your Teams" />
        <div className="pb-10">
          <JoinTeamDialog />
        </div>
      </div>
      <div className="[&_.inactive-row]:opacity-60">
        {/* @ts-expect-error I see no issue here */}
        <DataTable columns={columns} data={teams ?? []} />
      </div>
    </div>
  );
};

export default TeamsPage;