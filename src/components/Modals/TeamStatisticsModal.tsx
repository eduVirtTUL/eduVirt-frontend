import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTeamStats} from "@/data/statistics/useStats";
import {useTeam} from "@/data/team/useTeam";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {StatCard} from "@/components/StatCard";
import {Skeleton} from "@/components/ui/skeleton";
import {t} from "i18next";
import {useMemo, useState} from "react";
import {endOfMonth, endOfWeek, format, startOfMonth, startOfWeek} from "date-fns";
import {Calendar, Clock, Database, Layers, Timer} from "lucide-react";
import {ReservationTimelineDto} from "@/api/statistics";
import {cn} from "@/lib/utils";
import {useTranslation} from "react-i18next";

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

type TimeRange = 'day' | 'week' | 'month' | 'all';

const TimeRangeSelector = ({value, onChange}: { value: TimeRange; onChange: (value: TimeRange) => void }) => (
    <div className="flex gap-2">
        {[
            {value: 'all', label: t('statistics.timeRanges.day') as string},
            {value: 'week', label: t('statistics.timeRanges.week') as string},
            {value: 'month', label: t('statistics.timeRanges.month') as string},
        ].map(option => (
            <button
                key={option.value}
                onClick={() => onChange(option.value as TimeRange)}
                className={cn(
                    "px-3 py-1 rounded-md text-sm",
                    value === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                )}
            >
                {option.label}
            </button>
        ))}
    </div>
);

const formatDuration = (hours: number, t: { (key: string): string; (key: string, options: object): string }) => {
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

const processTimelineData = (timeline: ReservationTimelineDto[], range: TimeRange = 'day') => {
    if (!timeline?.length) return {chartData: [], config: {}, reservationsByDay: {}};

    const groupData = (date: Date) => {
        switch (range) {
            case 'day':
                return format(date, 'yyyy-MM-dd');
            case 'week':
                return format(startOfWeek(date), 'yyyy-MM-dd');
            case 'month':
                return format(startOfMonth(date), 'yyyy-MM');
            default:
                return format(date, 'yyyy-MM-dd');
        }
    };

    const reservationsByDay = timeline.reduce((acc, r) => {
        const day = format(new Date(r.startTime), 'yyyy-MM-dd');
        if (!acc[day]) acc[day] = [];
        acc[day].push(r);
        return acc;
    }, {} as Record<string, ReservationTimelineDto[]>);

    const resources = [...new Set(timeline.map(t => t.resourceName))];
    const config = resources.reduce((acc, resource, index) => {
        acc[resource] = {
            label: resource,
            color: `hsl(${index * 137.508} 50% 50%)`,
        };
        return acc;
    }, {} as ChartConfig);

    const groupedData = timeline.reduce((acc, reservation) => {
        const groupKey = groupData(new Date(reservation.startTime));
        if (!acc[groupKey]) acc[groupKey] = {};
        if (!acc[groupKey][reservation.resourceName]) {
            acc[groupKey][reservation.resourceName] = 0;
        }
        // @ts-expect-error - TS doesn't know that acc[groupKey] is defined
        acc[groupKey][reservation.resourceName] += reservation.lengthInHours;
        return acc;
    }, {} as Record<string, Record<string, number>>);

    const chartData = Object.entries(groupedData)
        .map(([date, resources]) => ({
            date,
            ...resources,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    const {t, i18n} = useTranslation();

    const [timeRange, setTimeRange] = useState<TimeRange>('week');

    console.table(teamStats);

    const {chartData, config, reservationsByDay} = useMemo(() =>
            processTimelineData(teamStats?.timeline ?? [], timeRange),
        [teamStats, timeRange]
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
                <DialogContent className="max-w-[90vw] max-h-[90vh]">
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
            <DialogContent className="max-w-[90vw] max-h-[90vh]">
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
                        value={formatDuration(teamStats?.totalHours ?? 0, t)}
                        icon={<Clock className="h-4 w-4"/>}
                    />
                    <StatCard
                        title={t("statistics.teams.averageLength")}
                        value={formatDuration(teamStats?.averageLength ?? 0, t)}
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
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle>{t("statistics.teams.dailyUsage")}</CardTitle>
                                    <TimeRangeSelector value={timeRange} onChange={setTimeRange}/>
                                </div>
                                <CardDescription>{t("statistics.teams.dailyUsageDescription")}</CardDescription>
                            </div>
                            <div className="border-l max-h-[400px] overflow-y-auto">
                                <div className={cn(
                                    "grid",
                                    Object.keys(config).length > 8
                                        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                                        : "grid-cols-1"
                                )}>
                                    {Object.entries(config).map(([key, value]) => (
                                        <button
                                            key={key}
                                            data-active={activeResource === key}
                                            className="relative z-30 flex flex-col justify-center gap-1 px-4 py-3 text-left border-b last:border-b-0 data-[active=true]:bg-muted/50"
                                            onClick={() => setActiveResource(activeResource === key ? null : key)}
                                        >
                                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                                                style={{backgroundColor: value.color}}
                                            />
                                            <span className="truncate">{value.label}</span>
                                        </span>
                                                                <span className="text-sm font-bold leading-none">
                                            {formatDuration(total[key] ?? 0, t)}
                                        </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 sm:p-6">
                            {chartData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <Calendar className="h-12 w-12 text-muted-foreground mb-4"/>
                                    <p className="text-lg font-medium text-center">
                                        {t("statistics.teams.noReservations")}
                                    </p>
                                    <p className="text-sm text-muted-foreground text-center mt-1">
                                        {t("statistics.teams.noReservationsDescription")}
                                    </p>
                                </div>
                            ) : (
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
                                            interval={timeRange === 'day' ? 0 : 'preserveStartEnd'}
                                            minTickGap={timeRange === 'day' ? 0 : 32}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                const formatOptions: Intl.DateTimeFormatOptions = {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    ...(timeRange === 'month' && {year: 'numeric'})
                                                };
                                                return new Intl.DateTimeFormat(i18n.language, formatOptions).format(date);
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

                                                const date = new Date(label);
                                                const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                });

                                                const timeFormatter = new Intl.DateTimeFormat(i18n.language, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });
                                                let relevantReservations: ReservationTimelineDto[] = [];

                                                switch (timeRange) {
                                                    case 'week': {
                                                        const weekStart = startOfWeek(date);
                                                        const weekEnd = endOfWeek(date);
                                                        relevantReservations = Object.entries(reservationsByDay)
                                                            .filter(([day]) => {
                                                                const resDate = new Date(day);
                                                                return resDate >= weekStart && resDate <= weekEnd;
                                                            })
                                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                            .flatMap(([_, res]) => res);
                                                        break;
                                                    }
                                                    case 'month': {
                                                        const monthStart = startOfMonth(date);
                                                        const monthEnd = endOfMonth(date);
                                                        relevantReservations = Object.entries(reservationsByDay)
                                                            .filter(([day]) => {
                                                                const resDate = new Date(day);
                                                                return resDate >= monthStart && resDate <= monthEnd;
                                                            })
                                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                            .flatMap(([_, res]) => res);
                                                        break;
                                                    }
                                                    default:
                                                        relevantReservations = reservationsByDay[format(date, 'yyyy-MM-dd')] || [];
                                                }

                                                return (
                                                    <div
                                                        className="bg-background border rounded-md shadow-sm p-2 min-w-[300px]">
                                                        <p className="font-medium mb-2 pb-2 border-b">
                                                            {timeRange === 'month'
                                                                ? new Intl.DateTimeFormat(i18n.language, {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                }).format(date)
                                                                : timeRange === 'week'
                                                                    ? `${new Intl.DateTimeFormat(i18n.language, {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    }).format(startOfWeek(date))} - ${new Intl.DateTimeFormat(i18n.language, {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    }).format(endOfWeek(date))}`
                                                                    : dateFormatter.format(date)}
                                                        </p>

                                                        <div className="mb-2 pb-2 border-b">
                                                            {payload
                                                                .filter(p => typeof p.value === 'number' && p.value > 0)
                                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                                .map((p: any) => (
                                                                    <p key={p.name}
                                                                       className="text-sm flex justify-between gap-2">
                                                                        <span>{config[p.name]?.label}</span>
                                                                        <span className="font-medium">
                                                                        {formatDuration(p.value, t)}
                                                                    </span>
                                                                    </p>
                                                                ))}
                                                        </div>

                                                        {relevantReservations.length > 0 ? (
                                                            <div className="space-y-2">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    {t("statistics.teams.reservationDetails")}
                                                                </p>
                                                                {relevantReservations.map((reservation, index) => (
                                                                    <div key={index}
                                                                         className="text-sm space-y-1 pb-2 last:pb-0 border-b last:border-0">
                                                                        <p className="font-medium">{reservation.resourceName}</p>
                                                                        <div
                                                                            className="flex justify-between text-muted-foreground">
                                                                        <span>
                                                                            {new Intl.DateTimeFormat(i18n.language, {
                                                                                day: 'numeric',
                                                                                month: 'short',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            }).format(new Date(reservation.startTime))} - {timeFormatter.format(new Date(reservation.endTime))}
                                                                        </span>
                                                                            <span>
                                                                            {formatDuration(reservation.lengthInHours, t)}
                                                                        </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground text-center py-2">
                                                                {t("statistics.teams.noReservationsForDay")}
                                                            </p>
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
                            )}
                        </CardContent>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
};