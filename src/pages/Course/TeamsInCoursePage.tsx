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
import {BarChart2, FileX2, SearchIcon, Undo2, UserPlus, XIcon} from "lucide-react";
import {useDialog} from "@/stores/dialogStore";
import CreateTeamModal from "@/components/Modals/CreateTeamModal";
import {useDebounce} from "use-debounce";
import {useCoursesTeamsByEmail} from "@/data/team/useCoursesTeamsByEmail";
import {SearchStudentsInCourseModal} from "@/components/Modals/SearchStudentsInCourseModal";
import {BulkStatelessPodManager} from "./BulkStatelessPodManager";
import {useNavigate} from "react-router";
import {useUser} from "@/stores/userStore";
import {CourseStatisticsModal} from "@/components/Modals/CourseStatisticsModal";

const TeamsInCoursePage: React.FC<Route.ComponentProps> = ({params: {id}}) => {
    const {t} = useTranslation();
    const {course} = useCourse(id);
    const isTeamBased = course?.courseType === "TEAM_BASED";
    const {open, isOpen, close} = useDialog();
    const {activeRole} = useUser();

    const [pageNumber, setPageNumber] = useState(0);
    const pageSize = 10;
    const [search, setSearch] = useState("");
    const [searchValue] = useDebounce(search, 500);
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [searchType, setSearchType] = useState<SearchType>("TEAM_NAME");

    const navigate = useNavigate();

    const {teams, isLoading} = useCourseTeams(
        id,
        pageNumber,
        pageSize,
        searchValue,
        searchType,
        sortOrder
    );

    const [emailSearchOpen, setEmailSearchOpen] = useState(false);
    const [emailPrefixes, setEmailPrefixes] = useState<string[]>([]);

    const {teams: teamsByEmail, isLoading: isLoadingEmails} = useCoursesTeamsByEmail(
        id,
        emailPrefixes,
        sortOrder
    );

    const [bulkPodManagerOpen, setBulkPodManagerOpen] = useState(false);


    const handleEmailSearch = (emails: string[]) => {
        setEmailPrefixes(emails);
        setPageNumber(0);
    };

    const handleRemoveEmailPrefix = (emailToRemove: string) => {
        setEmailPrefixes(current => current.filter(email => email !== emailToRemove));
    };


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <PageHeader title={course?.name ?? ""} type={t("coursePageB.teamsTable.title")}/>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    <Undo2/>
                    {t("coursePageB.teamsTable.back")}
                </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
                {(activeRole === "teacher" || activeRole === "administrator") && (
                    <Button
                        variant="outline"
                        onClick={() => open("courseStatistics")}
                    >
                        <BarChart2 className="h-4 w-4 mr-2"/>
                        {t("courseStatistics.button")}
                    </Button>
                )}

                <div className="flex gap-2 ml-auto">
                    {activeRole === "teacher" && !isTeamBased && (
                        <Button
                            variant="outline"
                            onClick={() => setBulkPodManagerOpen(true)}
                        >
                            <FileX2 className="h-4 w-4 mr-2"/>
                            {t("podManagement.button")}
                        </Button>
                    )}

                    {emailPrefixes.length > 0 ? (
                        <Button
                            variant="outline"
                            onClick={() => setEmailPrefixes([])}
                        >
                            <XIcon className="h-4 w-4 mr-2"/>
                            {t("coursePageB.courseTeamsPage.searchByEmail.clear")}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setEmailSearchOpen(true)}
                        >
                            <SearchIcon/>
                            {t("coursePageB.courseTeamsPage.searchByEmail.button")}
                        </Button>
                    )}
                    {isTeamBased ? (
                        activeRole === "teacher" && <CreateTeamModal courseId={id}/>
                    ) : (
                        activeRole === "teacher" && (
                            <Button variant="default" onClick={() => open("manageCourseUsers")}>
                                <UserPlus className="h-4 w-4 mr-2"/>
                                {t("coursePageB.teamsTable.students")}
                            </Button>
                        )
                    )}
                </div>
            </div>
            <TeamListCard
                isTeamBased={isTeamBased}
                teams={emailPrefixes.length > 0 ? teamsByEmail : teams?.items}
                totalPages={emailPrefixes.length > 0 ? undefined : teams?.page?.totalPages}
                isLoading={emailPrefixes.length > 0 ? isLoadingEmails : isLoading}
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
                emailPrefixes={emailPrefixes}
                onRemoveEmailPrefix={handleRemoveEmailPrefix}
                activeRole={activeRole}
            />
            <SearchStudentsInCourseModal
                open={emailSearchOpen}
                onOpenChange={setEmailSearchOpen}
                onSearch={handleEmailSearch}
            />
            <BulkStatelessPodManager
                open={bulkPodManagerOpen}
                onOpenChange={setBulkPodManagerOpen}
                courseId={id}
                teams={teams?.items ?? []}
                isLoading={isLoading}
            />
            <CourseStatisticsModal
                open={isOpen("courseStatistics")}
                onOpenChange={(open) => !open && close()}
                courseId={id}
            />
        </>
    );
};

export default TeamsInCoursePage;

export const handle: RouteHandle = {
    roles: ["teacher", "administrator"],
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
