import {useTranslation} from "react-i18next";
import {useCourse} from "@/data/course/useCourse";
import React, {useState} from "react";
import {SearchType, useCourseTeams} from "@/data/team/useCoursesTeams";
import TeamListCard from "./TeamListCard";
import PageHeader from "@/components/PageHeader";
import {Route} from "./+types";
import {t} from "i18next";
import {RouteHandle} from "@/AuthGuard";
import {Button} from "@/components/ui/button";
import {UserCog} from "lucide-react";
import {useDialog} from "@/stores/dialogStore";
import CreateTeamModal from "@/components/Modals/CreateTeamModal";
import {useDebounce} from "use-debounce";

const TeamsInCoursePage: React.FC<Route.ComponentProps> = ({params: {id}}) => {
    const {t} = useTranslation();
    const {course} = useCourse(id);
    const isTeamBased = course?.courseType === "TEAM_BASED";
    const {open} = useDialog();

    const [pageNumber, setPageNumber] = useState(0);
    const pageSize = 10;
    const [search, setSearch] = useState("");
    const [searchValue] = useDebounce(search, 500);
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [searchType, setSearchType] = useState<SearchType>("TEAM_NAME");

    const {teams, isLoading} = useCourseTeams(
        id,
        pageNumber,
        pageSize,
        searchValue,
        searchType,
        sortOrder
    );

    return (
        <>
            <PageHeader title={course?.name ?? ""} type={t("coursePageB.teamsTable.title")}/>
            <div className="flex justify-end mb-4">
                {isTeamBased ? (
                    <CreateTeamModal courseId={id}/>
                ) : (
                    <Button variant="secondary" onClick={() => open("manageCourseUsers")}>
                        <UserCog className="h-4 w-4 mr-2"/>
                        {t("coursePageB.teamsTable.students")}
                    </Button>
                )}
            </div>
            <TeamListCard
                isTeamBased={isTeamBased}
                teams={teams ? {
                    items: teams.items,
                    page: teams.page ? {totalPages: teams.page.totalPages ?? 0} : undefined
                } : undefined}
                isLoading={isLoading}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                courseId={id}
                courseName={course?.name ?? ""}
                search={search}
                setSearch={setSearch}
                searchType={searchType}
                setSearchType={setSearchType}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />
        </>
    );
};

export default TeamsInCoursePage;

export const handle: RouteHandle = {
    roles: ["teacher"],
};

interface MetaData {
    course?: {
        name?: string;
    };
}

export const meta = ({data}: { data: MetaData }) => {
    return [{
        title: t("pageTitles.courseTeams", {
            courseName: data?.course?.name ?? ""
        })
    }];
};
