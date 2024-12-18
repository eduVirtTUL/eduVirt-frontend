import PageHeader from "@/components/PageHeader.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import SystemIntervalList from "@/pages/Maintenance/SystemIntervalList.tsx";
import ClusterList from "@/pages/Clusters/ClusterList.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {ClusterGeneralDto} from "@/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {Link} from "react-router";
import React from "react";

const columns: ColumnDef<ClusterGeneralDto>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "comment",
        header: "Comment",
    },
    {
        id: "action",
        cell: ({ row }) => {
            const cluster = row.original;

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link to={`/maintenance/${cluster.id}`}>Show cluster intervals</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        }
    }
]

const MaintenancePage: React.FC = () => {
    return (
        <>
            <PageHeader title={'Maintenance'}/>
            <Tabs defaultValue="system">
                <TabsList>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="cluster">Cluster</TabsTrigger>
                </TabsList>
                <TabsContent value="system">
                    <SystemIntervalList active={true} />
                </TabsContent>
                <TabsContent value="cluster">
                    <ClusterList columns={columns} />
                </TabsContent>
            </Tabs>
        </>
    );
}


export default MaintenancePage