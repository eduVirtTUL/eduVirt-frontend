import CreateCourseModal from "@/components/Modals/CreateCourseModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/data/course/useCourses";
import { useDialog } from "@/stores/dialogStore";
import { ArrowDown, ArrowUp, PlusIcon, XIcon } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { CourseDto } from "@/api";
import DataTable from "../../components/DataTable";
import { useNavigate, useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import React from "react";
import i18next, { TFunction } from "i18next";
import { RouteHandle } from "@/AuthGuard";
import { useUser } from "@/stores/userStore";

const columns = (
  t: TFunction,
  onSortChange: () => void,
  sortOrder: "ASC" | "DESC"
): ColumnDef<CourseDto>[] => [
  {
    accessorKey: "name",
    header: () => {
      return (
        <Button variant="ghost" onClick={() => onSortChange()}>
          {t("courseListPage.table.name")}
          {sortOrder === "ASC" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => row.description ?? "-",
    header: t("courseListPage.table.description"),
  },
];

const CoursesPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const { t } = useTranslation();
  const pageNumber = parseInt(searchParams.get("page") ?? "0", 10);
  const pageSize = parseInt(searchParams.get("size") ?? "10", 10);
  const sort = (searchParams.get("sort") ?? "ASC") as "ASC" | "DESC";
  const [search, setSearch] = React.useState("");
  const [searchValue] = useDebounce(search, 500);
  const { courses, isLoading } = useCourses(
    pageNumber,
    pageSize,
    searchValue,
    sort
  );
  const { open } = useDialog();
  const nav = useNavigate();
  const { activeRole } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {activeRole === "administrator" && <CreateCourseModal />}
      <PageHeader title={t("courseListPage.title")} />
      {activeRole === "administrator" && (
        <div className="pb-5">
          <Button
            onClick={() => {
              open("createCourse");
            }}
          >
            <PlusIcon />
            {t("courseListPage.createCourse")}
          </Button>
        </div>
      )}
      <div className="flex flex-row gap-2 mb-5">
        <Input
          placeholder={t("courseListPage.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            setSearch("");
          }}
        >
          <XIcon />
          {t("courseListPage.clear")}
        </Button>
      </div>
      <DataTable
        data={courses?.items ?? []}
        columns={columns(
          t,
          () => {
            const newSort = sort === "ASC" ? "DESC" : "ASC";
            nav(`/courses?page=${pageNumber}&size=${pageSize}&sort=${newSort}`);
          },
          sort
        )}
        onRowClick={(row) => {
          const course = row.original;
          nav(`/courses/${course.id}`);
        }}
      />
      {courses?.items?.length !== 0 && (
        <Pagination className="mt-5">
          <PaginationContent>
            {pageNumber > 0 && (
              <>
                <PaginationItem>
                  <PaginationPrevious
                    href={`/courses?page=${pageNumber - 1}&size=${pageSize}`}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`/courses?page=${pageNumber - 1}&size=${pageSize}`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </>
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
            {courses?.page?.totalPages !== pageNumber + 1 && (
              <PaginationItem>
                <PaginationNext
                  href={`/courses?page=${pageNumber + 1}&size=${pageSize}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default CoursesPage;

export const handle: RouteHandle = {
  roles: ["administrator", "teacher"],
};

export const meta = () => {
  return [{ title: i18next.t("pageTitles.courses") }];
};
