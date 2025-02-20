import {Button} from "@/components/ui/button";
import {useCourse} from "@/data/course/useCourse";
import {useCourseResourceGroupPools} from "@/data/rgPool/useCourseResourceGroupPools";
import {useUser} from "@/stores/userStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useEffect, useState} from "react";
import {Route} from "./+types/index";
import {useCourseAccessKey} from "@/data/access-key/useCourseAccessKey";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Skeleton} from "@/components/ui/skeleton";
import {Link} from "react-router";
import {useDeleteCourse} from "@/data/course/useDeleteCourse";
import {ManageTeachersModal} from "@/components/Modals/ManageTeachersModal";
import {useTranslation} from "react-i18next";
import EditCourseModal from "@/components/Modals/EditCourseModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import CreatePoolModal from "@/components/Modals/CreatePoolModal";
import CreateCourseKeyModal from "@/components/Modals/CreateCourseKeyModal";
import PageHeader from "@/components/PageHeader";
import {
    CalendarDays,
    ChartCandlestickIcon,
    ChevronDown,
    ChevronUp,
    CircleOffIcon,
    Copy,
    ExternalLinkIcon,
    Info,
    KeyRound,
    PencilIcon,
    PlusIcon,
    RefreshCcw,
    Trash2Icon,
    UserCog,
    UsersIcon,
} from "lucide-react";
import ValueDisplay from "@/components/ValueDisplay";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import TeachersList from "@/components/TeachersList";
import StatefulResourceGroups from "@/pages/Course/StatefulResourceGroups";
import ResourceGroupPoolCard from "@/pages/Course/ResourceGroupPoolCard";
import {RouteHandle} from "@/AuthGuard";
import {t} from "i18next";
import {useResetCourse} from "@/data/course/useResetCourse";
import {useDialog} from "@/stores/dialogStore";
import {toast} from "sonner";

const CoursePage: React.FC<Route.ComponentProps> = ({params: {id}}) => {
    const {t} = useTranslation();

    const {open} = useDialog();

    const {course} = useCourse(id);
    const {courseResourceGroupPools} = useCourseResourceGroupPools(id);
    const isTeamBased = course?.courseType === "TEAM_BASED";
    const {course: courseAccessKey, isLoading: isCourseAccessKeyLoading} =
        useCourseAccessKey(id, {
            enabled: !isTeamBased,
        });

    const {deleteCourseAsync} = useDeleteCourse();
    const {resetCourseAsync} = useResetCourse();
    const {activeRole} = useUser();

    const [isTeachersOpen, setIsTeachersOpen] = useState(() => {
        const saved = localStorage.getItem(`courseTeachersCollapsible-${id}`);
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem(
            `courseTeachersCollapsible-${id}`,
            JSON.stringify(isTeachersOpen)
        );
    }, [isTeachersOpen, id]);

    return (
        <>
            <EditCourseModal id={id}/>
            <ConfirmationDialog
                header={t("coursePage.deleteAction.confirmation")}
                text={t("coursePage.deleteAction.confirmationText")}
                onConfirm={() => {
                    deleteCourseAsync(id);
                }}
                name="deleteCourseConfirmation"
            />
            <ConfirmationDialog
                header={t("coursePage.resetAction.confirmation")}
                text={t("coursePage.resetAction.confirmationText")}
                onConfirm={() => {
                    resetCourseAsync(id);
                }}
                name="resetCourseConfirmation"
            />
            <CreatePoolModal courseId={id}/>
            <CreateCourseKeyModal courseId={id}/>
            <PageHeader title={course?.name ?? ""} type={t("coursePage.title")}/>
            <div className="flex flex-row gap-2 justify-end mb-5">
                {(activeRole === "teacher" || activeRole === "administrator") && (
                    <Button asChild>
                        <Link to={`teams`}>
                            <UsersIcon className="mr-2 h-4 w-4"/>
                            {t("coursePageB.teamsTable.button")}
                        </Link>
                    </Button>
                )}
                {(activeRole === "teacher" || activeRole === "administrator") && (
                    <Button asChild>
                        <Link to={`./reservations`}>
                            <CalendarDays />
                            {t("reservations.title")}
                        </Link>
                    </Button>
                )}
                {activeRole === "administrator" && (
                    <Button asChild>
                        <Link to={`limits`}>
                            <ChartCandlestickIcon/>
                            {t("coursePage.limits")}
                        </Link>
                    </Button>
                )}
                <Button variant="secondary" onClick={() => open("editCourse")}>
                    <PencilIcon/>
                    {t("coursePage.edit")}
                </Button>
                {activeRole === "administrator" && (
                    <>
                        <Button
                            variant="destructive"
                            onClick={() => open("resetCourseConfirmation")}
                        >
                            <RefreshCcw/>
                            {t("coursePage.reset")}
                        </Button>
                        <Button variant="destructive" onClick={() => open("deleteCourseConfirmation")}>
                            <Trash2Icon/>
                            {t("coursePage.delete")}
                        </Button>
                    </>
                )}
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>{t("coursePage.details")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <ValueDisplay
                                className="col-span-2"
                                label={t("coursePage.description")}
                                value={course?.description ?? "-"}
                            />
                            <ValueDisplay
                                className="col-span-2"
                                label={t("coursePage.externalLink")}
                                value={
                                    course?.externalLink ? (
                                        <Link
                                            to={course.externalLink}
                                            className="flex flex-row items-center gap-2"
                                            target="_blank"
                                        >
                                            {course.externalLink}
                                            <ExternalLinkIcon className="w-4 h-4"/>
                                        </Link>
                                    ) : (
                                        "-"
                                    )
                                }
                            />
                            <ValueDisplay
                                className="col-span-2"
                                label={t("coursePageB.courseTypeCard.title")}
                                value={
                                    <div className="flex items-center gap-2">
                                        {isTeamBased
                                            ? t("courseType.teamBased")
                                            : t("courseType.solo")}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Info
                                                    className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"/>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80" side="right">
                                                <p className="text-sm">
                                                    {isTeamBased
                                                        ? t("courseType.teamBasedDescription")
                                                        : t("courseType.soloDescription")}
                                                </p>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                }
                            />
                            {!isTeamBased && (
                                <>
                                    {isCourseAccessKeyLoading || !courseAccessKey ? (
                                        <div className="col-span-2">
                                            {isCourseAccessKeyLoading ? (
                                                <Skeleton className="h-9 w-32"/>
                                            ) : (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => open("createCourseKey")}
                                                >
                                                    <KeyRound/>
                                                    {t("coursePageB.courseAccessKeyCard.button")}
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <ValueDisplay
                                            className="col-span-2"
                                            label={t("coursePageB.courseAccessKeyCard.title")}
                                            value={
                                                <div className="flex items-center gap-2 text-destructive">
                                                    {courseAccessKey.keyValue}
                                                    <Copy
                                                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                                        onClick={async () => {
                                                            await navigator.clipboard.writeText(
                                                                courseAccessKey.keyValue || ""
                                                            );
                                                            toast.success(
                                                                t(
                                                                    "coursePageB.courseAccessKeyCard.keyCopiedToast"
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            }
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <StatefulResourceGroups
                    courseId={id}
                    clusterId={course?.clusterId ?? ""}
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{t("coursePools.title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeRole === "teacher" && (
                            <Button onClick={() => open("createPool")} className="mb-4">
                                <PlusIcon/>
                                {t("coursePools.createPool")}
                            </Button>
                        )}
                        {courseResourceGroupPools?.length === 0 && (
                            <div className="text-muted-foreground flex flex-col justify-center items-center">
                                <CircleOffIcon/>
                                <span>{t("coursePools.noPools")}</span>
                                <span>{t("coursePools.noPoolsDescription")}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-4 gap-6">
                            {courseResourceGroupPools?.map((pool) => (
                                <ResourceGroupPoolCard
                                    key={pool.id}
                                    pool={pool}
                                    courseId={course?.id ?? ""}
                                    clusterId={course?.clusterId ?? ""}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col space-y-4">
                    <Collapsible open={isTeachersOpen} onOpenChange={setIsTeachersOpen}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{t("coursePageB.teachersCard.title")}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => open("manageTeachersModal")}
                                        >
                                            <UserCog className="h-4 w-4 mr-2"/>
                                            {t("coursePageB.teachersCard.manageTeachers")}
                                        </Button>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                {isTeachersOpen ? (
                                                    <ChevronUp className="h-4 w-4"/>
                                                ) : (
                                                    <ChevronDown className="h-4 w-4"/>
                                                )}
                                            </Button>
                                        </CollapsibleTrigger>
                                    </div>
                                </div>
                            </CardHeader>
                            <CollapsibleContent>
                                <CardContent>
                                    <TeachersList courseId={id}/>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                </div>
                <ManageTeachersModal courseId={id} courseName={course?.name ?? ""}/>
            </div>
        </>
    );
};

export default CoursePage;

export const handle: RouteHandle = {
    roles: ["administrator", "teacher"],
};

export const meta = () => {
    return [{title: t("pageTitles.course")}];
};
