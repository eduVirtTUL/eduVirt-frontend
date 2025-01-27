import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseStatsDto } from "@/api/statistics";
import { StatCard } from "../../components/StatCard";


export const Overview = ({ data }: { data: CourseStatsDto }) => {
  const teamsData = Object.entries(data.reservationsPerTeam).map(([name, value]) => ({
    name,
    reservations: value,
    hours: data.hoursPerTeam[name] || 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Reservations"
          value={data.totalReservations}
          description="All reservations in course"
        />
        <StatCard
          title="Total Hours"
          value={`${data.totalHours}h`}
          description="Total reservation time"
        />
        <StatCard
          title="Teams"
          value={data.totalTeams}
          description="Active teams"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reservations per Team</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamsData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--tooltip-background))',
                    color: 'hsl(var(--tooltip-text))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="reservations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours per Team</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamsData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--tooltip-background))',
                    color: 'hsl(var(--tooltip-text))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};