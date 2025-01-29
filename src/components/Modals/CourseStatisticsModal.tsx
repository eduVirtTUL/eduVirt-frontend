import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useCourseStats} from "@/data/statistics/useStats";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {StatCard} from "@/components/StatCard";
import {Skeleton} from "@/components/ui/skeleton";
import {useMemo, useState} from "react";
import {Calendar, Clock, Timer, Users} from "lucide-react";
import {cn} from "@/lib/utils";
import {useTranslation} from "react-i18next";
import {useCourse} from "@/data/course/useCourse";
import {CourseStatsDto} from "@/api/statistics";

const formatDuration = (hours: number, t: { (key: string): string; (key: string, options: object): string }) => {
    if (!hours) return '0' + t('statistics.teams.units.hours');

    const fullHours = Math.floor(hours);
    const minutes = Math.round((hours - fullHours) * 60);

    if (minutes === 0) {
        return `${fullHours}${t('statistics.teams.units.hours')}`;
    }

    if (fullHours === 0) {
        return `${minutes}${t('statistics.teams.units.minutes')}`;
    }

    return `${fullHours}${t('statistics.teams.units.hours')} ${minutes}${t('statistics.teams.units.minutes')}`;
};

interface CourseStatisticsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
}

export const CourseStatisticsModal = ({open, onOpenChange, courseId}: CourseStatisticsModalProps) => {
    const {data: courseStats, isLoading} = useCourseStats(courseId);
    const {t} = useTranslation();
    const [activeMetric, setActiveMetric] = useState<'reservations' | 'hours'>('reservations');
    const {course} = useCourse(courseId);

    const isTeamBased = course?.courseType === 'TEAM_BASED';
    const hasTeamStats = isTeamBased && courseStats && 'reservationsPerTeam' in courseStats;

    const chartData = useMemo(() => {
        if (!hasTeamStats || !courseStats) return [];

        const stats = courseStats as CourseStatsDto;
        const data = activeMetric === 'reservations'
            ? stats.reservationsPerTeam
            : stats.hoursPerTeam;

        if (!data) return [];

        return Object.entries(data)
            .map(([team, value]) => ({
                team,
                value: value ?? 0
            }))
            .sort((a, b) => b.value - a.value);
    }, [courseStats, activeMetric, hasTeamStats]);

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[90vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{t("courseStatistics.modalTitle")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full"/>
                        <Skeleton className="h-[400px]"/>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!courseStats) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{courseStats?.courseName} - {t("courseStatistics.modalTitle")}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <StatCard
                        title={t("courseStatistics.totalReservations")}
                        value={courseStats?.totalReservations ?? 0}
                        icon={<Calendar className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("courseStatistics.totalHours")}
                        value={formatDuration(courseStats?.totalHours, t)}
                        icon={<Clock className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("courseStatistics.averageLength")}
                        value={formatDuration(courseStats?.averageLength, t)}
                        icon={<Timer className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("courseStatistics.totalTeams")}
                        value={courseStats?.totalTeams ?? 0}
                        icon={<Users className="h-4 w-4"/>}
                    />
                </div>

                {isTeamBased && (
                    <Card>
                        {!hasTeamStats || Object.keys(courseStats.reservationsPerTeam).length === 0 ? (
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground mb-4"/>
                                <p className="text-lg font-medium text-center">
                                    {t("statistics.teams.noReservations")}
                                </p>
                                <p className="text-sm text-muted-foreground text-center mt-1">
                                    {t("courseStatistics.noReservationsDescription")}
                                </p>
                            </CardContent>
                        ) : (
                            <>
                                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                                        <CardTitle>{t("courseStatistics.teamMetrics")}</CardTitle>
                                        <CardDescription>{t("courseStatistics.teamMetricsDescription")}</CardDescription>
                                    </div>
                                    <div className="flex">
                                        {[
                                            {key: 'reservations', label: t("courseStatistics.metrics.reservations")},
                                            {key: 'hours', label: t("courseStatistics.metrics.hours")}
                                        ].map((metric) => (
                                            <button
                                                key={metric.key}
                                                data-active={activeMetric === metric.key}
                                                className={cn(
                                                    "relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                                )}
                                                onClick={() => setActiveMetric(metric.key as 'reservations' | 'hours')}
                                            >
                                                <span className="text-sm font-medium">{metric.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-2 sm:p-6">
                                    <div className="h-[400px] w-full">
                                        <ResponsiveContainer>
                                            <BarChart data={chartData}
                                                      margin={{top: 20, right: 30, left: 40, bottom: 20}}>
                                                <CartesianGrid vertical={false}/>
                                                <XAxis
                                                    dataKey="team"
                                                    height={40}
                                                    interval={0}
                                                    tickLine={false}
                                                    padding={{left: 10, right: 10}}
                                                />
                                                <YAxis
                                                    allowDecimals={false}
                                                    tickFormatter={(value) => Math.floor(value).toString()}
                                                />
                                                <Tooltip
                                                    cursor={{fill: 'rgba(0, 0, 0, 0.1)'}}
                                                    content={({active, payload}) => {
                                                        if (!active || !payload?.length) return null;
                                                        const data = payload[0]?.payload;
                                                        if (!data) return null;

                                                        return (
                                                            <div
                                                                className="bg-background border rounded-md shadow-sm p-2">
                                                                <p className="font-medium">{data.team}</p>
                                                                <p className="text-sm">
                                                                    {activeMetric === 'hours'
                                                                        ? formatDuration(data.value, t)
                                                                        : data.value}
                                                                </p>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    fill="hsl(var(--primary))"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
};