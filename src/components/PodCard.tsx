import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Link} from "react-router";
import {CalendarIcon} from "lucide-react";
import React from "react";

interface PodCardProps {
  id: string;
  resourceGroup: {
    id: string;
    name: string;
    isStateless: boolean;
  };
  course: {
    id: string;
    name: string;
    description: string;
    courseType: string;
    clusterId: string;
  };
}

export function PodCard({ id, resourceGroup, course }: PodCardProps) {
  return (
    <Card className="h-[320px] mx-auto w-[280px]">
      <CardContent className="p-6 flex flex-col gap-4">
        <div>
          <Badge variant={resourceGroup.isStateless ? "outline" : "default"} className="mb-2">
            {resourceGroup.isStateless ? "Stateless" : "Stateful"}
          </Badge>
          <h3 className="font-semibold text-xl">{resourceGroup.name}</h3>
        </div>
        <div className="space-y-4">
          <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-medium">{course.name}</p>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{course.description}</p>
              {/* <p className="text-sm text-muted-foreground">Cluster</p>
              <p className="font-medium">{course.clusterId}</p> */}
          </div>
          <div className={"grid grid-cols-1"}>
            <Link to={`/reservations/calendar/resource-group/${resourceGroup.id}`}
              state={{
                clusterId: course.clusterId,
                courseId: course.id,
                podId: id,
            }}>
              <Button className={"w-full"}>
                <CalendarIcon />
                Make a reservation
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}