import React from "react";
import { useParams } from "react-router-dom";
import { useTeam } from "@/data/team/useTeam";
import PageHeader from "@/components/PageHeader";

const TeamDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { team, isLoading } = useTeam(id!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageHeader title={team?.name ?? "Team Details"} />
      <p>ID: {team?.id}</p>
      <p>Key: {team?.key}</p>
      <p>Active: {team?.active ? "Yes" : "No"}</p>
      <p>Courses: {team?.courses.join(", ")}</p>
    </div>
  );
};

export default TeamDetailsPage;