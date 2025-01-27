import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTeamStats} from "@/data/statistics/useStats";
import {useTeam} from "@/data/team/useTeam";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {StatCard} from "@/components/StatCard";
import {Skeleton} from "@/components/ui/skeleton";
import {t} from "i18next";
import {useMemo, useState} from "react";
import {format} from "date-fns";
import {Calendar, Clock, Database, Layers, Timer} from "lucide-react";
import {ReservationTimelineDto} from "@/api/statistics";
import {cn} from "@/lib/utils";

export interface ChartConfig {
    [key: string]: {
        label: string;
        color: string;
    };
}

interface ChartContainerProps {
    children: React.ReactNode;
    className?: string;
    config?: ChartConfig;
}

const ChartStyle = ({config}: { config?: ChartConfig }) => {
    if (!config) return null;

    return (
        <style>
            {Object.entries(config).map(([key, value]) => `
        .color-${key} { 
          --color-${key}: ${value.color};
        }
      `).join('\n')}
        </style>
    );
};

const ChartContainer = ({children, className, config}: ChartContainerProps) => (
    <div className={cn("relative", className)}>
        <ChartStyle config={config}/>
        <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
        </ResponsiveContainer>
    </div>
);

const processTimelineData = (timeline: ReservationTimelineDto[]) => {
    if (!timeline?.length) return {chartData: [], config: {}};

    const dates = timeline.map(t => new Date(t.startTime));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const allDates: string[] = [];
    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
        allDates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const resources = [...new Set(timeline.map(t => t.resourceName))];
    const config = resources.reduce((acc, resource, index) => {
        acc[resource] = {
            label: resource,
            color: `hsl(${index * 137.508} 50% 50%)`,
        };
        return acc;
    }, {} as ChartConfig);

    const dailyData = timeline.reduce((acc, reservation) => {
        const day = format(new Date(reservation.startTime), 'yyyy-MM-dd');
        if (!acc[day]) acc[day] = {};
        acc[day][reservation.resourceName] = (acc[day][reservation.resourceName] || 0) + reservation.lengthInHours;
        return acc;
    }, {} as Record<string, Record<string, number>>);

    const chartData = allDates.map(date => ({
        date,
        ...resources.reduce((acc, resource) => ({
            ...acc,
            [resource]: dailyData[date]?.[resource] || 0
        }), {})
    }));

    const reservationsByDay = timeline.reduce((acc, reservation) => {
        const day = format(new Date(reservation.startTime), 'yyyy-MM-dd');
        if (!acc[day]) acc[day] = [];
        acc[day].push(reservation);
        return acc;
    }, {} as Record<string, ReservationTimelineDto[]>);

    return {chartData, config, reservationsByDay};
};

interface TeamStatisticsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    teamId: string;
}

export const TeamStatisticsModal = ({open, onOpenChange, courseId, teamId}: TeamStatisticsModalProps) => {
    const {data: teamStats, isLoading} = useTeamStats(courseId, teamId);
    const [activeResource, setActiveResource] = useState<string | null>(null);
    const {team} = useTeam(teamId);

    console.table(teamStats);

    const {chartData, config, reservationsByDay} = useMemo(() =>
            processTimelineData(teamStats?.timeline ?? []),
        [teamStats]
    );

    const total = useMemo(
        () => Object.keys(config || {}).reduce((acc, resource) => {
            // @ts-expect-error - TS doesn't know that chartData is defined
            acc[resource] = chartData?.reduce((sum, day) => sum + (day[resource] || 0), 0) || 0;
            return acc;
        }, {} as Record<string, number>),
        [chartData, config]
    );

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[80vw] max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{t("statistics.teams.modalTitle")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-[300px]"/>
                            <Skeleton className="h-[300px]"/>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[80vw] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>{team?.name} - {t("statistics.teams.modalTitle")}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <StatCard
                        title={t("statistics.teams.totalReservations")}
                        value={teamStats?.totalReservations ?? 0}
                        icon={<Calendar className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("statistics.teams.totalHours")}
                        value={`${teamStats?.totalHours ?? 0}h`}
                        icon={<Clock className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("statistics.teams.averageLength")}
                        value={`${teamStats?.averageLength?.toFixed(1) ?? 0}h`}
                        icon={<Timer className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("statistics.teams.statefulCount")}
                        value={teamStats?.statefulResourceCount ?? 0}
                        icon={<Database className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("statistics.teams.poolCount")}
                        value={teamStats?.statelessPoolCount ?? 0}
                        icon={<Layers className="h-4 w-4"/>}
                    />
                </div>

                {!teamStats || !team ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4"/>
                            <p className="text-lg font-medium text-center">
                                {t("statistics.teams.noReservations")}
                            </p>
                            <p className="text-sm text-muted-foreground text-center mt-1">
                                {t("statistics.teams.noReservationsDescription")}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                                <CardTitle>{t("statistics.teams.dailyUsage")}</CardTitle>
                                <CardDescription>
                                    {t("statistics.teams.dailyUsageDescription")}
                                </CardDescription>
                            </div>
                            <div className="flex">
                                {Object.entries(config).map(([key, value]) => (
                                    <button
                                        key={key}
                                        data-active={activeResource === key}
                                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                        onClick={() => setActiveResource(activeResource === key ? null : key)}
                                    >
                                        <span className="text-xs text-muted-foreground">
                                            {value.label}
                                        </span>
                                        <span className="text-lg font-bold leading-none sm:text-3xl">
                                            {total[key]}h
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 sm:p-6">
                            <ChartContainer
                                config={config}
                                className="aspect-auto h-[400px] w-full"
                            >
                                <BarChart
                                    data={chartData}
                                    margin={{

                                        right: 24,
                                        top: 24,

                                    }}
                                >
                                    <CartesianGrid vertical={false}/>
                                    <XAxis
                                        dataKey="date"
                                        height={60}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        }}
                                    />
                                    <YAxis
                                        width={40}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                        domain={[0, 'auto']}
                                        tickFormatter={(value) => Math.floor(value).toString()}
                                        interval={0}
                                    />
                                    <Tooltip
                                        cursor={{fill: 'rgba(0, 0, 0, 0.1)'}}
                                        content={({active, payload, label}) => {
                                            if (!active || !payload?.length) return null;
                                            const dayReservations = reservationsByDay?.[label] || [];

                                            return (
                                                <div
                                                    className="bg-background border rounded-md shadow-sm p-2 min-w-[300px]">
                                                    <p className="font-medium mb-2 pb-2 border-b">
                                                        {new Date(label).toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                    {dayReservations.length === 0 ? (
                                                        <p className="text-sm text-muted-foreground text-center py-2">
                                                            {t("statistics.teams.noReservationsForDay")}
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {dayReservations.map((reservation, index) => (
                                                                <div key={index}
                                                                     className="text-sm space-y-1 pb-2 last:pb-0 border-b last:border-0">
                                                                    <p className="font-medium">{reservation.resourceName}</p>
                                                                    <div
                                                                        className="flex justify-between text-muted-foreground">
                                                                            <span>
                                                                                {format(new Date(reservation.startTime), 'HH:mm')} -
                                                                                {format(new Date(reservation.endTime), 'HH:mm')}
                                                                            </span>
                                                                        <span>{reservation.lengthInHours}h</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    />
                                    {Object.keys(config).map((resource) => (
                                        (!activeResource || activeResource === resource) && (
                                            <Bar
                                                key={resource}
                                                dataKey={resource}
                                                fill={(config as ChartConfig)[resource]?.color ?? '#000000'}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        )
                                    ))}
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
};