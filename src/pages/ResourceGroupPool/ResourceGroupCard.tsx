import { ResourceGroupDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router";

type ResourceGroupCardProps = {
  resourceGroup: ResourceGroupDto;
};

const ResourceGroupCard: React.FC<ResourceGroupCardProps> = ({
  resourceGroup,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{resourceGroup.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to={`/rg/${resourceGroup.id}`}>Resource Group Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceGroupCard;
