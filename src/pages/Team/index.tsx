import PageHeader from "@/components/PageHeader";
import { useTeams } from "@/data/team/useTeams";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

const TeamsPage = () => {
  const { teams, isLoading } = useTeams();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="Teams" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Courses</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.id}>
              <TableCell>
                <Link to={`/teams/${team.id}`} className="text-blue-500 hover:underline">
                  {team.name}
                </Link>
              </TableCell>
              <TableCell>{team.active ? "Yes" : "No"}</TableCell>
              <TableCell>{team.courses.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamsPage;