import CreateCourseModal from "@/components/Modals/CreateCourseModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/data/course/useCourses";
import { useDialog } from "@/stores/dialogStore";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PlusIcon,
} from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { CourseDto } from "@/api";
import DataTable from "../../components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

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
  const [searchParams] = useSearchParams();

  const pageNumber = parseInt(searchParams.get("page") ?? "0", 10);
  const pageSize = parseInt(searchParams.get("size") ?? "10", 10);
  const { courses, isLoading } = useCourses(pageNumber, pageSize);
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

      <DataTable data={courses?.items ?? []} columns={columns} />
      <Pagination>
        <PaginationContent>
          {pageNumber > 0 && (
            <PaginationItem>
              <Button variant="ghost" asChild>
                <Link to={`/courses?page=${pageNumber - 1}&size=${pageSize}`}>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Link>
              </Button>
            </PaginationItem>
          )}

          {pageNumber > 0 && (
            <PaginationItem>
              <PaginationLink
                href={`/courses?page=${pageNumber - 1}&size=${pageSize}`}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              href={`/courses?page=${pageNumber}&size=${pageSize}`}
              isActive
            >
              {pageNumber + 1}
            </PaginationLink>
          </PaginationItem>
          {(courses?.page?.totalPages ?? 0) > pageNumber + 1 && (
            <PaginationItem>
              <PaginationLink
                href={`/courses?page=${pageNumber + 1}&size=${pageSize}`}
              >
                {pageNumber + 2}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <Button variant="ghost" asChild>
              <Link to={`/courses?page=${pageNumber + 1}&size=${pageSize}`}>
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default CoursesPage;
