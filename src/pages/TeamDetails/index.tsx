import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTeam} from "@/data/team/useTeam";
import {useCourse} from "@/data/course/useCourse";
import {useStatefulPodsForTeam} from "@/data/pods/useStatefulPodsForTeam";
import {useStatelessPodsForTeam} from "@/data/pods/useStatelessPodsForTeam";
import PageHeader from "@/components/PageHeader";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown, ChevronUp, Info, LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useLeaveTeamOrCourse} from "@/data/team/users/useLeaveTeamOrCourse";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import {jwtDecode} from "jwt-decode";
import {useDialog} from "@/stores/dialogStore";
import {toast} from "sonner";
import {PodCard} from "@/components/PodCard";
import ValueDisplay from "@/components/ValueDisplay";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useTranslation} from "react-i18next";

const TeamDetailsPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {team, isLoading} = useTeam(id ?? "");
    const {course} = useCourse(team?.course?.id ?? "");
    const {statefulPods, isLoading: isLoadingStatefulPods} = useStatefulPodsForTeam(id ?? "");
    const {statelessPods, isLoading: isLoadingStatelessPods} = useStatelessPodsForTeam(id ?? "");
    const [isMembersOpen, setIsMembersOpen] = useState(() => {
        const saved = localStorage.getItem('teamMembersCollapsible');
        return saved ? JSON.parse(saved) : true;
    });
    const {leaveTeam} = useLeaveTeamOrCourse();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const teamMembers = team?.users ?? [];
    const isTeamBased = course?.courseType === "TEAM_BASED";
    const {open} = useDialog();
    const {t} = useTranslation();

    useEffect(() => {
        const checkAuthorization = async () => {
            const token = localStorage.getItem('token');

            const decoded = jwtDecode<{ sub: string }>(token || '');
            const userId = decoded.sub;

            if (!isLoading && team) {
                if (!team.users?.some(user => user.id === userId)) {
                    toast.error(t("teamDetails.error.notInTeam"));
                } else {
                    setIsAuthorized(true);
                }
            } else if (!isLoading && !team) {
                toast.error(t("teamDetails.error.teamNotFound"));
            }
        };

        checkAuthorization();
    }, [team, isLoading, navigate]);

    useEffect(() => {
        localStorage.setItem('teamMembersCollapsible', JSON.stringify(isMembersOpen));
    }, [isMembersOpen]);

    if (isLoading || isAuthorized === null || !isAuthorized) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-[200px]"/>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-[150px]"/>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} className="h-[100px]"/>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const handleLeaveTeamClick = () => {
        open("confirmation");
    };

    const handleConfirmLeave = () => {
        if (id) {
            leaveTeam(id);
            navigate(-1);
        }
    };

    return (
        <>
            <PageHeader title={team?.name ?? ""} type={t("teamDetails.title")}/>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>
                                <div className="flex flex-row items-center justify-between">
                                    <span>{t("teamDetails.detailsCard.title")}</span>
                                    <div className="flex flex-row items-center justify-start gap-2">
                                        <Button
                                            variant="destructive"
                                            onClick={handleLeaveTeamClick}
                                            className="flex items-center gap-2"
                                        >
                                            <LogOut className="h-4 w-4"/>
                                            {t("teamDetails.leaveTeam.button")}
                                        </Button>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                <ValueDisplay
                                    value={course?.name ?? ""}
                                    label={t("teamDetails.detailsCard.courseName")}
                                />
                                <div className="flex items-center gap-2">
                                    <ValueDisplay
                                        value={isTeamBased ? t("courseType.teamBased") : t("courseType.solo")}
                                        label={t("teamDetails.detailsCard.courseType")}
                                    />
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
                                <div className="col-span-2">
                                    <ValueDisplay
                                        value={course?.description ?? ""}
                                        label={t("teamDetails.detailsCard.courseDescription")}
                                    />
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col space-y-4">
                    <Collapsible open={isMembersOpen} onOpenChange={setIsMembersOpen}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{t("teamDetails.teamMembers")}</CardTitle>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            {isMembersOpen ? (
                                                <ChevronUp className="h-4 w-4"/>
                                            ) : (
                                                <ChevronDown className="h-4 w-4"/>
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                            </CardHeader>
                            <CollapsibleContent>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {teamMembers.map(user => (
                                            <div
                                                key={user.id}
                                                className="flex items-center space-x-4 rounded-lg border p-4"
                                            >
                                                <div
                                                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                    <span className="text-lg">
                                                        {user.firstName?.[0] || user.userName?.[0] || 'U'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        {user.firstName && user.lastName
                                                            ? `${user.firstName} ${user.lastName}`
                                                            : user.userName || user.email}
                                                    </p>
                                                    {user.email && user.email !== user.userName && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {user.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {(!team?.users || team.users.length === 0) && (
                                            <p className="text-muted-foreground text-center py-4 col-span-3">
                                                {t("teamDetails.teamEmpty")}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>

                    {isLoadingStatefulPods || isLoadingStatelessPods ? (
                        <div className="flex flex-wrap gap-2 px-4 md:px-8">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-[280px] w-full md:w-1/3"/>
                            ))}
                        </div>
                    ) : ((!statefulPods || statefulPods.length === 0) && (!statelessPods || statelessPods?.length === 0)) ? (
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>{t("teamDetails.assignedPods")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground py-8">{t("teamDetails.noPods")}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>{t("teamDetails.assignedPods")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="grid gap-4 md:grid-cols-3">
                                    {[
                                        ...(statefulPods || []).map(pod => ({
                                            ...pod,
                                            isStateless: false
                                        })),
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        ...(statelessPods || []).map((pod: any) => ({
                                            ...pod,
                                            isStateless: true
                                        }))
                                    ]
                                        .filter((pod, index, self) =>
                                                index === self.findIndex(p =>
                                                    p.isStateless
                                                        ? p.resourceGroupPool?.id === pod.resourceGroupPool?.id
                                                        : p.resourceGroup?.id === pod.resourceGroup?.id
                                                )
                                        )
                                        .map((pod) => (
                                            ((pod.resourceGroup || pod.resourceGroupPool) && pod.course) && (
                                                <PodCard
                                                    key={pod.id}
                                                    id={pod.id || ''}
                                                    resourceGroup={pod.isStateless ? {
                                                        id: pod.resourceGroupPool?.id || '',
                                                        name: pod.resourceGroupPool?.name || '',
                                                        isStateless: true
                                                    } : {
                                                        id: pod.resourceGroup?.id || '',
                                                        name: pod.resourceGroup?.name || '',
                                                        isStateless: false
                                                    }}
                                                    course={{
                                                        id: pod.course.id || '',
                                                        name: pod.course.name || '',
                                                        description: pod.course.description || '',
                                                        courseType: pod.course.courseType || '',
                                                        clusterId: pod.course.clusterId || ''
                                                    }}
                                                />
                                            )
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
                <ConfirmationDialog
                    header={t("teamDetails.leaveTeam.confirmHeader")}
                    text={t("teamDetails.leaveTeam.confirmText")}
                    onConfirm={handleConfirmLeave}
                />
            </div>
        </>
    );
};

export default TeamDetailsPage;