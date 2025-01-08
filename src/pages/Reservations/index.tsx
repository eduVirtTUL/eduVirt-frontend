import { useTranslation } from "react-i18next";
import { useStudentCourses } from "@/data/course/useStudentCourses";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { CourseDto } from "@/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";

const columns = (
  t: TFunction
): ColumnDef<CourseDto>[] => [
  {
    accessorKey: "name",
    header: t("courses.table.columns.name"),
  },
  {
    accessorKey: "description",
    header: t("courses.table.columns.description")
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">
                {t("courses.table.openMenu")}
              </span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/reservations/courses/${course.id}`}>
                {t("courses.table.showReservations")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ReservationPage: React.FC = () => {
  const { t } = useTranslation();

  const [ pageNumber, setPageNumber ] = useState<number>(0);
  const [ pageSize ] = useState<number>(10);

  const { courses, isLoading } = useStudentCourses({
    page: pageNumber,
    size: pageSize,
  });

  const { courses: nextCourses, isLoading: nextLoading } = useStudentCourses({
    page: pageNumber + 1,
    size: pageSize,
  });

  if (isLoading || nextLoading) {
    return (
      <>
        <PageHeader title={t("courses.title")} />
          <div className="space-y-6">
            <div className="rounded-md border">
              <div className="border-b">
                <div className="grid grid-cols-2 p-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-4 w-[100px]" />
                  ))}
                </div>
              </div>
              <div>
                {Array.from({ length: pageSize }, (_, i) => i + 1).map((row) => (
                  <div key={row} className="grid grid-cols-2 p-4 border-b">
                    {[1, 2].map((col) => (
                      <Skeleton key={col} className="h-4 w-[100px]" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 mt-4">
              <Skeleton className="h-8 w-[100px]"/>
              <Skeleton className="h-8 w-[40px]"/>
              <Skeleton className="h-8 w-[100px]"/>
            </div>
          </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("courses.title")} />

      <SimpleDataTable
          columns={columns(t)}
          data={courses ?? []}
      />

      <SimplePagination
          page={pageNumber}
          setPage={setPageNumber}
          hasMore={nextCourses !== undefined && nextCourses.length !== 0}
      />
    </>
  );
};

export default ReservationPage;