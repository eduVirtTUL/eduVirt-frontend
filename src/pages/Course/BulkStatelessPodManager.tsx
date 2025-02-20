import {useEffect, useMemo, useState} from "react";
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
import {useCreateStatelessPodsBatch} from "@/data/pods/useCreateStatelessPodsBatch";
import {useDeleteStatelessPodsBatch} from "@/data/pods/useDeleteStatelessPodsBatch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ArrowDownIcon, ArrowUpIcon, CircleOffIcon, Plus, Search, Trash2} from "lucide-react";
import {useDialog} from "@/stores/dialogStore";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface BulkStatelessPodManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: string;
    teams: TeamWithKeyDto[];
    isLoading: boolean;
}

const TableSkeleton = () => (
    <div className="space-y-2">
        {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="flex gap-4 p-4">
                <div className="w-5 h-5 rounded bg-muted animate-pulse"/>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 bg-muted rounded animate-pulse"/>
                    <div className="h-3 w-1/3 bg-muted rounded animate-pulse"/>
                </div>
            </div>
        ))}
    </div>
);

const ResourcePoolsSkeleton = () => (
    <div className="space-y-4">
        {Array.from({length: 3}).map((_, i) => (
            <div key={i} className="flex gap-2 items-start p-2">
                <div className="w-4 h-4 rounded-full bg-muted animate-pulse mt-1"/>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse"/>
                    <div className="h-3 w-3/4 bg-muted rounded animate-pulse"/>
                </div>
            </div>
        ))}
    </div>
);

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
    const {createStatelessPodsBatch} = useCreateStatelessPodsBatch();
    const {deleteStatelessPodsBatch} = useDeleteStatelessPodsBatch();
    const [podFilter, setPodFilter] = useState<'all' | 'withPod' | 'withoutPod'>('all');
    const {open: openDialog} = useDialog();

    useEffect(() => {
        setSelectedTeams([]);
    }, [selectedPool]);

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
        if (!teams?.items) return [];
    
        return teams.items.map(team => ({
            ...team,
            hasPod: selectedPool && statelessPods ? statelessPods.some(
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

        if (hasPodsCount === 0) return 'create';
        if (hasPodsCount === selectedTeamsData.length) return 'delete';
        return 'mixed';
    }, [selectedTeams, teamsWithPodStatus, selectedPool]);

    const filteredTeams = useMemo(() => {
        if (!selectedPool || !teamsWithPodStatus) return [];
    
        return teamsWithPodStatus
            .filter(team => {
                const searchMatch = search.toLowerCase() === '' ||
                    team.users?.some(user =>
                        (user.firstName + ' ' + user.lastName)?.toLowerCase().includes(search.toLowerCase()) ||
                        user.email?.toLowerCase().includes(search.toLowerCase())
                    );
    
                const podStatusMatch =
                    podFilter === 'all' ? true :
                        podFilter === 'withPod' ? team.hasPod :
                            !team.hasPod;
    
                return searchMatch && podStatusMatch;
            })
            .sort((a, b) => {
                const aName = a.users?.[0]?.lastName || '';
                const bName = b.users?.[0]?.lastName || '';
                return sortOrder === "ASC"
                    ? aName.localeCompare(bName)
                    : bName.localeCompare(aName);
            });
    }, [teamsWithPodStatus, search, podFilter, sortOrder, selectedPool]);

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
                <div className="space-y-1">
                    {row.original.users?.map(user => (
                        <div key={user.id} className="flex flex-col">
                            <span>
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.userName}
                            </span>
                            {user.email && user.email !== user.userName && (
                                <span className="text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            )}
                        </div>
                    ))}
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
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{t("podManagement.title")}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-4 flex-1 min-h-0">
                        <div className="w-1/3 border rounded-lg p-4">
                            <h3 className="font-medium mb-4">{t("podManagement.resourcePools")}</h3>
                            <ScrollArea className="h-[60vh]">
                                {isLoadingPools ? (
                                    <ResourcePoolsSkeleton/>
                                ) : pools && pools.length > 0 ? (
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
                                ) : (
                                    <div
                                        className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-center">
                                        <CircleOffIcon className="h-8 w-8"/>
                                        <span>{t("podManagement.noResourceGroupPools")}</span>
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                        <div className="flex-1 space-y-4 flex flex-col min-h-0">
                            {selectedPool ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                                            <Input
                                                placeholder={t("podManagement.searchPlaceholder")}
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-8 max-w-sm"
                                            />
                                        </div>
                                        <Select
                                            value={podFilter}
                                            onValueChange={(value: 'all' | 'withPod' | 'withoutPod') => setPodFilter(value)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={t("podManagement.filterByPod")}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t("podManagement.filters.all")}</SelectItem>
                                                <SelectItem
                                                    value="withPod">{t("podManagement.filters.withPod")}</SelectItem>
                                                <SelectItem
                                                    value="withoutPod">{t("podManagement.filters.withoutPod")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setSortOrder(current => current === "ASC" ? "DESC" : "ASC")}
                                        >
                                            {sortOrder === "ASC" ? <ArrowUpIcon className="h-4 w-4"/> :
                                                <ArrowDownIcon className="h-4 w-4"/>}
                                        </Button>
                                    </div>
                                    <ScrollArea className="flex-1 border rounded-md">
                                        {(isLoadingTeams || isLoadingPods) ? (
                                            <TableSkeleton/>
                                        ) : (
                                            <DataTable
                                                columns={columns}
                                                data={filteredTeams}
                                                // @ts-expect-error - this is a hack to get the types to work
                                                onRowSelectionChange={setSelectedTeams}
                                                selectedRows={selectedTeams}
                                            />
                                        )}
                                    </ScrollArea>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                    {t("podManagement.selectPoolPrompt")}
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-end gap-2">
                        <Button
                            variant="destructive"
                            onClick={() => openDialog("deleteStatelessPodsBatch")}
                            disabled={
                                !selectedPool ||
                                selectedTeams.length === 0 ||
                                processingTeams.length > 0 ||
                                selectionStatus !== 'delete'
                            }
                        >
                            <Trash2/>
                            {t("podManagement.deletePods")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openDialog("createStatelessPodsBatch")}
                            disabled={
                                !selectedPool ||
                                selectedTeams.length === 0 ||
                                processingTeams.length > 0 ||
                                selectionStatus !== 'create'
                            }
                        >
                            <Plus/>
                            {t("podManagement.createPods")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                name="createStatelessPodsBatch"
                header={t("podManagement.confirmCreate.title")}
                text={t("podManagement.confirmCreate.description")}
                onConfirm={handleBulkCreate}
            />

            <ConfirmationDialog
                name="deleteStatelessPodsBatch"
                header={t("podManagement.confirmDelete.title")}
                text={t("podManagement.confirmDelete.description")}
                onConfirm={handleBulkDelete}
            />
        </>
    );
}