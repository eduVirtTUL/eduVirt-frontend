import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Calendar} from "lucide-react";
import {cn} from "@/lib/utils";
import {useTranslation} from "react-i18next";
import {usePodReservationCount} from "@/data/reservation/usePodReservationCount";
import {useNavigate} from "react-router";

interface PodCardProps {
    id: string;
    resourceGroup: {
        id: string;
        name: string;
        isStateless: boolean;
        maxRentTime: number;
        maxRent: number;
    };
    course: {
        id: string;
        name: string;
        description: string;
        courseType: string;
        clusterId: string;
    };
}

export function PodCard({id, resourceGroup, course}: PodCardProps) {
    const {t} = useTranslation();
    const { count } = usePodReservationCount({courseId: course.id, podId: id});
    const navigate = useNavigate();

    return (
        <Card className="h-auto mx-2 w-auto transition-all duration-200 hover:shadow-lg hover:border-primary/50">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <Badge
                            variant={resourceGroup.isStateless ? "outline" : "default"}
                            className={cn(
                                "transition-colors",
                                resourceGroup.isStateless ? "hover:bg-primary/10" : "hover:bg-primary/90"
                            )}
                        >
                            {resourceGroup.isStateless ? t("podType.stateless") : t("podType.stateful")}
                        </Badge>
                        {!resourceGroup.isStateless && resourceGroup.maxRent && (
                            <Badge variant="secondary">
                                {t("podCard.maxRent")}: {resourceGroup.maxRent}
                            </Badge>
                        )}
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-2">{resourceGroup.name}</h3>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{t("podCard.course")}</p>
                        <p className="font-medium text-sm">{course.name}</p>
                        <p className="text-sm text-muted-foreground mt-2">{t("podCard.description")}</p>
                        <p className="text-sm">{course.description}</p>
                    </div>
                </div>
                <div className="pt-4 mt-auto">
                    <Button
                        className="w-full gap-2 transition-all hover:scale-[1.02]"
                        variant="default"
                        disabled={count !== undefined ? resourceGroup.maxRent != 0 && count >= resourceGroup.maxRent : true}
                        onClick={() => navigate(
                            resourceGroup.isStateless ?
                                `/reservations/calendar/resource-group-pool/${resourceGroup.id}` :
                                `/reservations/calendar/resource-group/${resourceGroup.id}`, { state: {
                                    clusterId: course.clusterId,
                                    courseId: course.id,
                                    podId: id,
                                    maxRentTime: resourceGroup.maxRentTime
                                }}
                            )}
                        >
                            <Calendar className="h-4 w-4"/>
                            {t("podCard.makeAReservation")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}