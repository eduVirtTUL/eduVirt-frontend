import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTeam} from "@/data/team/useTeam";
import {useCourse} from "@/data/course/useCourse";
import {useStatefulPodsForTeam} from "@/data/pods/useStatefulPodsForTeam";

import PageHeader from "@/components/PageHeader";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown, ChevronUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {StatusDot} from "@/components/StatusDot";
import {useLeaveTeamOrCourse} from "@/data/team/useLeaveTeamOrCourse";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import {jwtDecode} from "jwt-decode";
import {useDialog} from "@/stores/dialogStore";
import {toast} from "sonner";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {PodCard} from "@/components/PodCard";

const TeamDetailsPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {team, isLoading} = useTeam(id ?? "");
    const {course} = useCourse(team?.course?.id ?? "");
    const {statefulPods, isLoading: isLoadingStatefulPods} = useStatefulPodsForTeam(id ?? "");
    const [isMembersOpen, setIsMembersOpen] = useState(true);
    const {leaveTeam} = useLeaveTeamOrCourse();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const teamMembers = team?.users ?? [];
    const {open} = useDialog();

    useEffect(() => {
        const checkAuthorization = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/teams');
                return;
            }

            const decoded = jwtDecode<{ sub: string }>(token);
            const userId = decoded.sub;

            if (!isLoading && team) {
                if (!team.users?.includes(userId)) {
                    toast.error("You need to be a member of this team to view its details");
                    navigate('/teams');
                } else {
                    setIsAuthorized(true);
                }
            } else if (!isLoading && !team) {
                toast.error("Team not found");
                navigate('/teams');
            }
        };

        checkAuthorization();
    }, [team, isLoading, navigate]);

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
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <PageHeader title={team?.name ?? ""}/>
                <div className="pb-10">
                    <Button
                        variant="destructive"
                        onClick={handleLeaveTeamClick}
                    >
                        Leave Team
                    </Button>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Course:</h3>
                    {team?.course ? (
                        <span className="rounded-full bg-muted px-3 py-1 text-sm">
                            {course?.name ?? "Loading..."}
                        </span>
                    ) : (
                        <p className="text-base">No course assigned</p>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Status:</h3>
                    <div className="flex items-center space-x-2">
                        <StatusDot active={team?.active ?? false}/>
                        <span
                            className="text-sm font-medium text-muted-foreground">{team?.active ? "Active" : "Inactive"}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid gap-6">
                <Collapsible open={isMembersOpen} onOpenChange={setIsMembersOpen}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Team Members</CardTitle>
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
                                            key={user}
                                            className="flex items-center space-x-4 rounded-lg border p-4"
                                        >
                                            <div
                                                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <span className="text-lg">U</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm break-all">{user}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!team?.users || team.users.length === 0) && (
                                        <p className="text-muted-foreground text-center py-4 col-span-3">
                                            Team is empty
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Assigned Pods</h2>
                    {isLoadingStatefulPods ? (
                        <div className="flex gap-4 px-8">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-[280px] w-full"/>
                            ))}
                        </div>
                    ) : (statefulPods?.length === 0) ? (
                        <p className="text-center text-muted-foreground py-8">No pods assigned to this team</p>
                    ) : (
                        <div className="px-8">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <CarouselContent>
                                    {[...(statefulPods || [])]
                                        .filter((pod, index, self) =>
                                                index === self.findIndex(p =>
                                                    p.resourceGroup?.id === pod.resourceGroup?.id
                                                )
                                        )
                                        .map((pod) => (
                                            <CarouselItem
                                                key={pod.id}
                                                className="basis-full md:basis-1/3 lg:basis-1/3"
                                            >
                                                {pod.resourceGroup && pod.course && (
                                                    <PodCard
                                                        id={pod.id || ''}
                                                        resourceGroup={{
                                                            id: pod.resourceGroup.id || '',
                                                            name: pod.resourceGroup.name || '',
                                                            isStateless: pod.resourceGroup.stateless || false
                                                        }}
                                                        course={{
                                                            id: pod.course.id || '',
                                                            name: pod.course.name || '',
                                                            description: pod.course.description || '',
                                                            courseType: pod.course.courseType || '',
                                                            clusterId: pod.course.clusterId || ''
                                                        }}
                                                    />
                                                )}
                                            </CarouselItem>
                                        ))}
                                </CarouselContent>
                                <div className="flex justify-end gap-2 mt-4">
                                    <CarouselPrevious variant="outline" className="h-8 w-8"/>
                                    <CarouselNext variant="outline" className="h-8 w-8"/>
                                </div>
                            </Carousel>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationDialog
                header="Leave Team"
                text="Are you sure you want to leave this team? This action cannot be undone."
                onConfirm={handleConfirmLeave}
            />
        </div>
    );
};

export default TeamDetailsPage;