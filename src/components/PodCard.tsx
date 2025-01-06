import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PodCardProps {
  id: string;
  resourceGroup: {
    id: string;
    name: string;
    isStateless: boolean;
  };
  course: {
    name: string;
    description: string;
    courseType: string;
    clusterId: string;
  };
}

export function PodCard({ resourceGroup, course }: PodCardProps) {
  return (
    <Card className="h-[280px] mx-auto w-[280px]">
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
        </div>
      </CardContent>
    </Card>
  );
}