import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, XIcon} from "lucide-react"
import {Button} from "@/components/ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useUsersTeams} from "@/data/team/useUsersTeams";
import JoinTeamModal from "@/components/Modals/JoinTeamModal";
import {Skeleton} from "@/components/ui/skeleton";
import {useTranslation} from "react-i18next";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {RouteHandle} from "@/AuthGuard";
import {t} from "i18next";
import React from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";

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
    const {t} = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const pageNumber = parseInt(searchParams.get("page") ?? "0", 10);
    const pageSize = parseInt(searchParams.get("size") ?? "10", 10);
    const {teams, isLoading} = useUsersTeams(pageNumber, pageSize);

    const [search, setSearch] = React.useState("");
    const [searchValue] = useDebounce(search, 500);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-[200px]"/>
                    <Skeleton className="h-10 w-[100px]"/>
                </div>
                <div className="rounded-md border">
                    <div className="border-b">
                        <div className="grid grid-cols-4 p-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-4 w-[100px]"/>
                            ))}
                        </div>
                    </div>
                    <div>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <div key={row} className="grid grid-cols-4 p-4 border-b">
                                {[1, 2, 3, 4].map((col) => (
                                    <Skeleton key={col} className="h-4 w-[100px]"/>
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
            accessorKey: "name",
            header: ({column}) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start pl-2"
                >
                    {t('teamsList.table.columns.name')}
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            ),
        },
        {
            accessorKey: "course.name",
            header: t('teamsList.table.columns.course'),
        },
    ];

    return (
        <div>
            <PageHeader title={t('teamsList.title')} />
            <div className="pb-5">
                <JoinTeamModal />
            </div>
            <div className="[&_.inactive-row]:opacity-60">
                <DataTable
                    columns={columns}
                    // @ts-expect-error API types mismatch with local types
                    data={teams?.items ?? []}
                    onRowClick={(row) => {
                        navigate(`/teams/${row.original.id}`);
                    }}
                />
            </div>
            <div className="mt-4">
                {teams?.items?.length !== 0 && (
                    <Pagination>
                        <PaginationContent>
                            {pageNumber > 0 && (
                                <>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={`/teams?page=${pageNumber - 1}&size=${pageSize}`}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            href={`/teams?page=${pageNumber - 1}&size=${pageSize}`}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}
                            <PaginationItem>
                                <PaginationLink
                                    href={`/teams?page=${pageNumber}&size=${pageSize}`}
                                    isActive
                                >
                                    {pageNumber + 1}
                                </PaginationLink>
                            </PaginationItem>
                            {(teams?.page?.totalPages ?? 0) > pageNumber + 1 && (
                                <PaginationItem>
                                    <PaginationLink
                                        href={`/teams?page=${pageNumber + 1}&size=${pageSize}`}
                                    >
                                        {pageNumber + 2}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            {teams?.page?.totalPages !== pageNumber + 1 && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={`/teams?page=${pageNumber + 1}&size=${pageSize}`}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    );
};

export default TeamsPage;

export const handle: RouteHandle = {
    roles: ["administrator", "teacher"],
};

export const meta = () => {
    return [{title: t("pageTitles.course")}];
};