import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTeam } from "@/data/team/useTeam";
import { useCourse } from "@/data/course/useCourse";
import { useResourceGroups } from "@/data/resourceGroup/useResourceGroups";
import { useCourseResourceGroupPools } from "@/data/rgPool/useCourseResourceGroupPools";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/StatusDot";


const TeamDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { team, isLoading } = useTeam(id ?? "");
  const { course } = useCourse(team?.course ?? "");
  const { resourceGroups } = useResourceGroups();
  const { courseResourceGroupPools } = useCourseResourceGroupPools(team?.course ?? "");
  const [isMembersOpen, setIsMembersOpen] = useState(true);
  const [isReservationsOpen, setIsReservationsOpen] = useState(true);
  const [isTeamInfoOpen, setIsTeamInfoOpen] = useState(true);
  const [assignedResources, setAssignedResources] = useState<{
    resourceGroups: string[];
    resourceGroupPools: string[];
  }>({ resourceGroups: [], resourceGroupPools: [] });

  useEffect(() => {
    const stored = localStorage.getItem('teamResourceAssignments');
    if (stored && id) {
      const assignments = JSON.parse(stored);
      const teamAssignment = assignments.find((a: any) => a.teamId === id);
      if (teamAssignment) {
        setAssignedResources({
          resourceGroups: teamAssignment.resourceGroups,
          resourceGroupPools: teamAssignment.resourceGroupPools
        });
      }
    }
  }, [id]);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[1,2,3].map(i => (
                  <Skeleton key={i} className="h-[100px]" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const teamMembers = team?.users?.map(userId => 
    users?.find(u => u.id === userId)
  ).filter(Boolean) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title={ team?.name ?? ""} />
      
      <div className="grid gap-6">
        <Collapsible open={isMembersOpen} onOpenChange={setIsMembersOpen}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isMembersOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
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
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg">U</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm break-all">{user.id}</p>
                        <p className="text-sm text-muted-foreground">User ID</p>
                      </div>
                    </div>
                  ))}
                  {(!team?.users || team.users.length === 0) && (
                    <p className="text-muted-foreground text-center py-4 col-span-3">
                      No members found
                    </p>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={isTeamInfoOpen} onOpenChange={setIsTeamInfoOpen}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Info</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isTeamInfoOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Team ID</h3>
                      <p className="text-base">{team?.id}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Team Key</h3>
                      <p className="text-base">{team?.key}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="flex items-center space-x-2">
                        <StatusDot active={team?.active ?? false} />
                        <span>{team?.active ? "Active" : "Inactive"}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Course</h3>
                      {team?.course ? (
                        <span className="rounded-full bg-muted px-3 py-1 text-sm">
                          {course?.name ?? "Loading..."}
                        </span>
                      ) : (
                        <p className="text-base">No course assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={isReservationsOpen} onOpenChange={setIsReservationsOpen}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assigned Resources</CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isReservationsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Resource Groups</h3>
                    <div className="space-y-2">
                      {assignedResources.resourceGroups.map(groupId => {
                        const group = resourceGroups?.find(g => g.id === groupId);
                        return group ? (
                          <div key={groupId} className="p-3 rounded-lg border">
                            {group.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Resource Group Pools</h3>
                    <div className="space-y-2">
                      {assignedResources.resourceGroupPools.map(poolId => {
                        const pool = courseResourceGroupPools?.find(p => p.id === poolId);
                        return pool ? (
                          <div key={poolId} className="p-3 rounded-lg border">
                            {pool.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
};

export default TeamDetailsPage;