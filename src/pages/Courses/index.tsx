import CreateCourseModal from "@/components/Modals/CreateCourseModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/data/course/useCourses";
import { useDialog } from "@/stores/dialogStore";
import { ArrowUpDown, MoreHorizontal, PlusIcon } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { CourseDto } from "@/api";
import DataTable from "../../components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";

const columns: ColumnDef<CourseDto>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { accessorKey: "description", header: "Description" },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit course</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/courses/${course.id}`}>View course</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const CoursesPage: React.FC = () => {
  const { courses, isLoading } = useCourses();
  const { open } = useDialog();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateCourseModal />
      <PageHeader title="Courses" />
      <div className="pb-5">
        <Button
          onClick={() => {
            open("createCourse");
          }}
        >
          <PlusIcon />
          New course
        </Button>
      </div>

      <DataTable data={courses ?? []} columns={columns} />
    </>
  );
};

export default CoursesPage;
