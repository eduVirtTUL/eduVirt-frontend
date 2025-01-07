import { ResourceGroupPoolDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router";

type ResourceGroupPoolCardProps = {
  pool: ResourceGroupPoolDto;
};

const ResourceGroupPoolCard: React.FC<ResourceGroupPoolCardProps> = ({
  pool,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{pool.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{pool.description}</p>
        <div className="flex justify-start">
          <Button asChild>
            <Link to={`/pools/${pool.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceGroupPoolCard;
