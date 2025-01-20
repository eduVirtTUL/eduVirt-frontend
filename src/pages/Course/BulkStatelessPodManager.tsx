import {useMemo, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";
import {ColumnDef} from "@tanstack/react-table";
import {TeamWithKeyDto} from "@/api";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea} from "@/components/ui/scroll-area";
import {RadioGroup} from "@/components/ui/radio-group";
import {RadioGroupItem} from "@radix-ui/react-radio-group";
import {useCourseResourceGroupPools} from "@/data/rgPool/useCourseResourceGroupPools";
import DataTable from "@/components/DataTable";
import {useStatelessPodsForCourse} from "@/data/pods/useStatelessPodsForCourse";
import {useCourseTeams} from "@/data/team/useCoursesTeams";
import {cn} from "@/lib/utils";
import {keys} from "@/data/keys";
import { useCreateStatelessPodsBatch } from "@/data/pods/useCreateStatelessPodsBatch";
import { useDeleteStatelessPodsBatch } from "@/data/pods/useDeleteStatelessPodsBatch";

interface BulkStatelessPodManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    teams: TeamWithKeyDto[];
    isLoading: boolean;
}

export function BulkStatelessPodManager({
                                            open,
                                            onOpenChange,
                                            courseId,
                                        }: BulkStatelessPodManagerProps) {
    const {t} = useTranslation();
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [selectedPool, setSelectedPool] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [processingTeams, setProcessingTeams] = useState<string[]>([]);
    const { createStatelessPodsBatch } = useCreateStatelessPodsBatch();
    const { deleteStatelessPodsBatch } = useDeleteStatelessPodsBatch();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedTeams([]);
            setSelectedPool(null);
            setSearch("");
        }
        onOpenChange(open);
    };

    const handleBulkCreate = async () => {
        if (!selectedPool) return;
    
        const teamsToProcess = selectedTeams.filter(
            teamId => !teamsWithPodStatus.find(t => t.id === teamId)?.hasPod
        );
    
        setProcessingTeams(teamsToProcess);
    
        const createDtos = teamsToProcess.map(teamId => ({
            teamId,
            resourceGroupPoolId: selectedPool,
        }));
    
        await createStatelessPodsBatch(createDtos);
        setSelectedTeams([]);
        setProcessingTeams([]);
    };

    const handleBulkDelete = async () => {
        const teamsWithPods = selectedTeams.filter(
            teamId => teamsWithPodStatus.find(t => t.id === teamId)?.hasPod
        );
    
        const podIds = statelessPods
            ?.filter(pod => 
                pod.team?.id && teamsWithPods.includes(pod.team.id) && 
                pod.resourceGroupPool?.id === selectedPool
            )
            .map(pod => pod.id!)
            ?? [];
    
        setProcessingTeams(teamsWithPods);
        await deleteStatelessPodsBatch(podIds);
        setSelectedTeams([]);
        setProcessingTeams([]);
    };

    const {teams, isLoading: isLoadingTeams} = useCourseTeams(
        courseId,
        0,
        300,
        "",
        "STUDENT_NAME",
        sortOrder
    );

    const {statelessPods, isLoading: isLoadingPods} = useStatelessPodsForCourse(courseId, {
        queryKey: [keys.STATELESS_POD, 'course', courseId, 'bulk']
    });
    const {courseResourceGroupPools: pools, isLoading: isLoadingPools} = useCourseResourceGroupPools(courseId);

    const teamsWithPodStatus = useMemo(() => {
        if (!teams?.items || !statelessPods) return [];

        return teams.items.map(team => ({
            ...team,
            hasPod: selectedPool ? statelessPods.some(
                pod => pod?.team?.id === team.id && pod.resourceGroupPool?.id === selectedPool
            ) : false
        }));
    }, [teams?.items, statelessPods, selectedPool]);


    const selectionStatus = useMemo(() => {
        if (!selectedTeams.length || !selectedPool) {
            return null;
        }

        const selectedTeamsData = teamsWithPodStatus.filter(
            team => selectedTeams.includes(team.id!)
        );

        const hasPodsCount = selectedTeamsData.filter(t => t.hasPod).length;

        console.log({
            selectedTeams,
            selectedTeamsData,
            hasPodsCount,
            totalSelected: selectedTeamsData.length
        });

        if (hasPodsCount === 0) return 'create';
        if (hasPodsCount === selectedTeamsData.length) return 'delete';
        return 'mixed';
    }, [selectedTeams, teamsWithPodStatus, selectedPool]);


    const columns: ColumnDef<TeamWithKeyDto & { hasPod: boolean }>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            const allIds = teamsWithPodStatus.map(team => team.id!);
                            setSelectedTeams(allIds);
                        } else {
                            setSelectedTeams([]);
                        }
                    }}
                    disabled={!selectedPool}
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={selectedTeams.includes(row.original.id!)}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            setSelectedTeams(prev => [...prev, row.original.id!]);
                        } else {
                            setSelectedTeams(prev => prev.filter(id => id !== row.original.id));
                        }
                    }}
                    disabled={!selectedPool}
                />
            ),
        },
        {
            accessorKey: "name",
            header: t("podManagement.columns.name"),
        },
        {
            accessorKey: "users",
            header: t("podManagement.columns.members"),
            cell: ({row}) => (
                <div>
                    {row.original.users?.map(user =>
                        user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email
                    ).join(", ")}
                </div>
            ),
        },
        {
            id: "podStatus",
            header: t("podManagement.columns.status"),
            cell: ({row}) => (
                <Badge
                    variant={row.original.hasPod ? "default" : "secondary"}
                    className={row.original.hasPod ? "bg-green-100 text-green-800" : ""}
                >
                    {row.original.hasPod
                        ? t("podManagement.status.hasPod")
                        : t("podManagement.status.noPod")}
                </Badge>
            ),
        }
    ];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{t("podManagement.title")}</DialogTitle>
                </DialogHeader>

                <div className="flex gap-4">
                    <div className="w-1/3 border rounded-lg p-4">
                        <h3 className="font-medium mb-4">{t("podManagement.resourcePools")}</h3>
                        <ScrollArea className="h-[60vh]">
                            <RadioGroup value={selectedPool || ""} onValueChange={setSelectedPool}>
                                {pools?.map(pool => (
                                    <div
                                        key={pool.id}
                                        className={cn(
                                            "flex items-center space-x-2 p-2 rounded",
                                            selectedPool === pool.id && "bg-accent"
                                        )}
                                    >
                                        <RadioGroupItem value={pool.id!} id={pool.id}/>
                                        <label htmlFor={pool.id} className="flex-1 cursor-pointer">
                                            <div>{pool.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {pool.description}
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </ScrollArea>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t("podManagement.search")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            {selectedPool && selectedTeams.length > 0 && (
                                <>
                                    {selectionStatus === 'create' && (
                                        <Button
                                            onClick={handleBulkCreate}
                                            disabled={processingTeams.length > 0}
                                        >
                                            {t("podManagement.createPods")}
                                        </Button>
                                    )}
                                    {selectionStatus === 'delete' && (
                                        <Button
                                            variant="destructive"
                                            onClick={handleBulkDelete}
                                            disabled={processingTeams.length > 0}
                                        >
                                            {t("podManagement.deletePods")}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                        <ScrollArea className="h-[60vh] border rounded-md">
                            <DataTable
                                columns={columns}
                                data={teamsWithPodStatus}
                                // @ts-expect-error this doesn't impact the page
                                onRowSelectionChange={(selectedRows: string[]) => {
                                    console.log("Selection changed to:", selectedRows);
                                    setSelectedTeams(selectedRows);
                                }}
                                selectedRows={selectedTeams}
                                loading={isLoadingTeams || isLoadingPods}
                            />
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}