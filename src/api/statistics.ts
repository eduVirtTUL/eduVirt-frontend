export interface CourseStatsDto {
    courseId: string;
    courseName: string;
    totalReservations: number;
    totalHours: number;
    averageLength: number;
    totalTeams: number;
    reservationsPerTeam: Record<string, number>;
    hoursPerTeam: Record<string, number>;
  }
  
  export interface ReservationTimelineDto {
    startTime: string;
    endTime: string;
    resourceName: string;
    lengthInHours: number;
  }
  
  export interface TeamStatsDto {
    teamId: string;
    teamName: string;
    totalReservations: number;
    totalHours: number;
    averageLength: number;
    statefulResourceCount: number;
    statelessPoolCount: number;
    timeline: ReservationTimelineDto[];
  }
  
  export interface ResourceStatsDto {
    resourceId: string;
    resourceName: string;
    isStateful: boolean;
    totalReservations: number;
    totalHours: number;
    totalTeams: number;
    reservationsPerTeam: Record<string, number>;
    hoursPerTeam: Record<string, number>;
  }