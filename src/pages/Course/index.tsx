import PageHeader from "@/components/PageHeader";
import {Button} from "@/components/ui/button";
import {useCourse} from "@/data/course/useCourse";
import {useCourseResourceGroupPools} from "@/data/rgPool/useCourseResourceGroupPools";

import {useDialog} from "@/stores/dialogStore";
import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import DataTable from "@/components/DataTable";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import CreateTeamDialog from "../Team/create-team-dialog";
import AddCourseKeyDialog from "./add-course-key-dialog";
import {useCourseTeams} from "@/data/team/useCoursesTeams";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import React, {useState} from "react";
import AssignResourcesDialog from "./assign-resources-dialog";
import {useParams} from "react-router";

const StatusDot = ({active}: { active: boolean }) => (
    <div className={cn(
        "h-3 w-3 rounded-full",
        active ? "bg-green-500" : "bg-red-500"
    )}/>
);

const CoursePage: React.FC = () => {
    const {id} = useParams();
    const {course} = useCourse(id!);
    const {open} = useDialog();
    const {courseResourceGroupPools} = useCourseResourceGroupPools(id!);
    const {teams, isLoading} = useCourseTeams(id!);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [assignResourcesOpen, setAssignResourcesOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<any, any>[] = [
        {
            accessorKey: "active",
            header: "Status",
            cell: ({row}) => (
                <div className="flex items-center">
                    <StatusDot active={row.original.active}/>
                    <span className="ml-2">{row.original.active ? "Active" : "Inactive"}</span>
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start pl-2"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({row}) => (
                <div className="flex items-center">
                    <span>{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "key",
            header: "Key",
            cell: ({row}) => row.original.key,
        },
        {
            id: "actions",
            cell: ({row}) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                            setSelectedTeamId(row.original.id);
                            setAssignResourcesOpen(true);
                        }}>
                            Assign Resources
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title={course?.name ?? ""}/>
            <Card>
                <CardHeader>
                    <CardTitle>Course Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Team-Based Course</h3>
                            <p className="text-sm text-muted-foreground">
                                {course?.teamBased ? "Yes" : "No"}
                            </p>
                        </div>
                        {!course?.teamBased && (
                            <div>
                                {course?.courseKey ? (
                                    <div className="text-sm">
                                        <span className="font-medium">Course Key: </span>
                                        {course.courseKey}
                                    </div>
                                ) : (
                                    <AddCourseKeyDialog courseId={id!}/>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Resource Group Pools</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => open("createPool")} className="mb-4">Add pool</Button>
                    <div className="space-y-4">
                        {courseResourceGroupPools?.map((pool) => (
                            <div key={pool.id} className="p-4 border rounded-lg">
                                {pool.name}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Teams</CardTitle>
                        {course?.teamBased && <CreateTeamDialog courseId={id!}/>}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="[&_.inactive-row]:opacity-60">
                        {!isLoading && teams && <DataTable columns={columns} data={teams}/>}
                    </div>
                </CardContent>
            </Card>
            {selectedTeamId && (
                <AssignResourcesDialog
                    open={assignResourcesOpen}
                    onOpenChange={setAssignResourcesOpen}
                    teamId={selectedTeamId}
                    courseId={id!}
                />
            )}
        </div>
    );
};

export default CoursePage;
