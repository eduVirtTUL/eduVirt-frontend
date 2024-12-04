import PageHeader from "@/components/PageHeader";
import DataTable from "@/pages/Team/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import EnrollTeamDialog from "./enroll-team-dialog";
import { useCourse } from "@/data/course/useCourse";
import { useUsersTeams } from "@/data/team/useUsersTeams";

const StatusDot = ({ active }: { active: boolean }) => (
  <div className={cn(
    "h-3 w-3 rounded-full",
    active ? "bg-green-500" : "bg-red-500"
  )} />
);

const CourseNameCell = ({ courseId }: { courseId: string }) => {
  const { course } = useCourse(courseId);
  return <span>{course?.name ?? "Loading..."}</span>;
};

const TeamsPage = () => {
  const { teams, isLoading } = useUsersTeams();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any, any>[] = [

    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <StatusDot active={row.original.active} />
          <span className="ml-2">{row.original.active ? "Active" : "Inactive"}</span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-start pl-2"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => {
        const courseId = row.original.course;
        return courseId ? <CourseNameCell courseId={courseId} /> : "No course";
      },
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
          <EnrollTeamDialog />
        </div>
      </div>
      <div className="[&_.inactive-row]:opacity-60">
        {teams && <DataTable columns={columns} data={teams} />}
      </div>
    </div>
  );
};

export default TeamsPage;