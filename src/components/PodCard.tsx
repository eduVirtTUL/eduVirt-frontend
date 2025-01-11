import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="h-[320px] mx-auto w-[280px] transition-all duration-200 hover:shadow-lg hover:border-primary/50">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="space-y-2 flex-1">
          <Badge 
            variant={resourceGroup.isStateless ? "outline" : "default"} 
            className={cn(
              "mb-2 transition-colors",
              resourceGroup.isStateless ? "hover:bg-primary/10" : "hover:bg-primary/90"
            )}
          >
            {resourceGroup.isStateless ? "Stateless Pod" : "Stateful Pod"}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-2">{resourceGroup.name}</h3>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Course</p>
            <p className="font-medium text-sm line-clamp-1">{course.name}</p>
            <p className="text-sm text-muted-foreground mt-2">Description</p>
            <p className="text-sm line-clamp-2">{course.description}</p>
          </div>
        </div>
        <div className="pt-4 mt-auto">
          <Link to={resourceGroup.isStateless ?
              `/reservations/calendar/resource-group-pool/${resourceGroup.id}` :
              `/reservations/calendar/resource-group/${resourceGroup.id}`}
            state={{
              clusterId: course.clusterId,
              courseId: course.id,
              podId: id,
            }}>
              <Button
                  className="w-full gap-2 transition-all hover:scale-[1.02]"
                  variant="default"
              >
              <Calendar className="h-4 w-4" />
              Make a reservation
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}