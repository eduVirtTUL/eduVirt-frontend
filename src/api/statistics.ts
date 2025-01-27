export interface BaseCourseStatsDto {
  courseId: string;
  courseName: string;
  totalReservations: number;
  totalHours: number;
  averageLength: number;
  totalTeams: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SoloCourseStatsDto extends BaseCourseStatsDto {}

export interface CourseStatsDto extends BaseCourseStatsDto {
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
  