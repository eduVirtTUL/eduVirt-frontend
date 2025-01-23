import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Checkbox} from "@/components/ui/checkbox"
import {useState} from "react"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {useStatefulPodsForTeam} from "@/data/pods/useStatefulPodsForTeam"
import {useResourceGroupVms} from "@/data/resourceGroup/useResourceGroupVms"
import {AlertTriangle, ChevronDown, ChevronRight, CircleAlert, ExternalLink, PlusIcon, Trash2} from "lucide-react"
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {ResourceGroupDto} from "@/api"
import {useTeam} from "@/data/team/useTeam"
import {useCreateStatefulPod} from "@/data/pods/useCreateStatefulPod"
import {useDeleteStatefulPod} from "@/data/pods/useDeleteStatefulPod"
import {useDialog} from "@/stores/dialogStore"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import {useTranslation} from "react-i18next"
import {Link, useParams} from "react-router"
import {appEnv} from "@/environment"
import {useStatefulPodsForCourse} from "@/data/pods/useStatefulPodsForCourse"
import {useStatefulResourceGroups} from "@/data/course/resourceGroups/useStatefulResourceGroups"
import MaxRentModal from "@/components/Modals/MaxRentModal";

interface StatefulPodDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teamId: string
}

const CollapsibleRow = ({rg, checked, onCheckedChange, hasPod}: {
    rg: ResourceGroupDto,
    checked: boolean,
    onCheckedChange: (checked: boolean) => void,
    hasPod: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const {vms, isLoading} = useResourceGroupVms(rg.id!)
    const {t} = useTranslation();

    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={hasPod || checked}
                        onCheckedChange={onCheckedChange}
                        disabled={hasPod}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                        <span>{rg.name}</span>
                        <Badge variant="outline" className="px-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-auto p-1 gap-1 flex items-center"
                                onClick={(e) => e.stopPropagation()}
                                asChild
                            >
                                <Link
                                    target="_blank"
                                    to={`/rg/${rg.id}`}
                                >
                                    <ExternalLink className="h-3 w-3"/>
                                    <span className="text-xs">eduVirt</span>
                                </Link>
                            </Button>
                        </Badge>
                        {(!isLoading && hasPod) && (
                            <CircleAlert className="h-4 w-4"/>
                        )}
                        {(!isLoading && vms?.length === 0) && (
                            <AlertTriangle className="h-4 w-4 text-orange-500"/>
                        )}
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className={cn(!isOpen && "hidden")}>
                <TableCell colSpan={2}>
                    <div className="flex flex-col gap-2">
                        {hasPod && (
                            <div className="flex items-center gap-2 mb-2">
                                <CircleAlert className="h-4 w-4"/>
                                <div>{t("statefulPodManagement.alerts.hasAssociatedPod")}</div>
                            </div>
                        )}
                        {isLoading ? (
                            <Skeleton className="h-12 w-full"/>
                        ) : (
                            (vms ?? []).length === 0 ? (
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-500"/>
                                    <div className="text-orange-500">{t("statefulPodManagement.alerts.noVMs")}</div>
                                </div>
                            ) : (
                                (vms ?? []).map(vm => (
                                    <div key={vm.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{vm.name}</Badge>
                                            <Badge variant="outline">{vm.cpuCount} vCPU</Badge>
                                            <Badge variant="outline">{vm.memory} MiB</Badge>
                                            <Badge variant="outline">{(vm.nics ?? []).length} NICs</Badge>
                                            <Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-auto p-1 gap-1 flex items-center"
                                                    onClick={(e) => e.stopPropagation()}
                                                    asChild
                                                >
                                                    <Link
                                                        target="_blank"
                                                        to={`${appEnv.ovirtEngineUrl}/webadmin/?locale=en_US#vms-general;name=${vm.name}`}
                                                    >
                                                        <ExternalLink className="h-3 w-3"/>
                                                        <span
                                                            className="text-xs">{t("resourceGroupEditor.virtualMachinesList.ovirt")}</span>
                                                    </Link>
                                                </Button>
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </TableCell>
            </TableRow>
        </>
    )
}

const StatefulPodDrawer: React.FC<StatefulPodDrawerProps> = ({
                                                                 open, onOpenChange, teamId
                                                             }) => {
    const {id: courseId} = useParams<{ id: string }>();
    const {statefulPods = [], isLoading: isLoadingStateful} = useStatefulPodsForTeam(teamId);
    const {team, isLoading: isLoadingTeam} = useTeam(teamId);
    const [selectedResource, setSelectedResource] = useState<string | null>(null);
    const {statefulResourceGroups, isLoading: isLoadingRG} = useStatefulResourceGroups(courseId!);
    const {createStatefulPod} = useCreateStatefulPod();
    const {deleteStatefulPod, isPending: isDeleting} = useDeleteStatefulPod();
    const {open: openDialog} = useDialog();
    const [podToDelete, setPodToDelete] = useState<string | null>(null);
    const {t} = useTranslation();
    const [showMaxRentModal, setShowMaxRentModal] = useState(false);

    const {pods: coursePods, isLoading: isLoadingCoursePods} = useStatefulPodsForCourse(courseId!);

    const podsArray = Array.isArray(statefulPods) ? statefulPods : []; // To assure that statefulPods is an array when 204 response is returned

    const handleSubmit = () => {
        setShowMaxRentModal(true);
    }

    const handleCreatePod = (maxRent: number) => {
        createStatefulPod({
            teamId,
            resourceGroupId: selectedResource!,
            maxRent
        });
        setSelectedResource(null);
    }

    const handleClickPodDelete = (podId: string) => {
        setPodToDelete(podId);
        openDialog("deleteStatefulPod");
    };

    const handleConfirmPodDelete = () => {
        if (podToDelete) {
            deleteStatefulPod(podToDelete);
            setPodToDelete(null);
        }
    }

    const hasAssignedPod = (rgId: string) => {
        return coursePods?.some(pod => pod.resourceGroup?.id === rgId) ?? false;
    };

    return (
        <>
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="h-[75vh]">
                    <DrawerHeader>
                        <DrawerTitle>
                            {isLoadingTeam ? (
                                <Skeleton className="h-6 w-48"/>
                            ) : (
                                `${t("statefulPodManagement.title")} ${team?.name}`
                            )}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('statefulPodManagement.resourceGroups')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[50vh]">
                                        {isLoadingRG || isLoadingCoursePods ? (
                                            <div className="space-y-2">
                                                <Skeleton className="h-12 w-full"/>
                                                <Skeleton className="h-12 w-full"/>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableBody>
                                                    {(Array.isArray(statefulResourceGroups) ? statefulResourceGroups : []).length > 0 ? (
                                                        (Array.isArray(statefulResourceGroups) ? statefulResourceGroups : [])
                                                            .map((rg) => (
                                                                <CollapsibleRow
                                                                    key={rg.id}
                                                                    rg={rg}
                                                                    checked={selectedResource === rg.id}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            setSelectedResource(rg.id!)
                                                                        } else {
                                                                            setSelectedResource(null)
                                                                        }
                                                                    }}
                                                                    hasPod={hasAssignedPod(rg.id!)}
                                                                />
                                                            ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={2}
                                                                       className="text-center text-muted-foreground py-4">
                                                                {t('statefulPodManagement.noResourceGroups')}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </ScrollArea>
                                    <div className="flex justify-end mt-4">
                                        <Button
                                            onClick={handleSubmit}
                                            className="w-32"
                                            disabled={!selectedResource}
                                        >
                                            <PlusIcon/>
                                            {t('statefulPodManagement.createPod')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("statefulPodManagement.teamPods")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[50vh]">
                                        {isLoadingStateful ? (
                                            <div className="space-y-2">
                                                <Skeleton className="h-12 w-full"/>
                                                <Skeleton className="h-12 w-full"/>
                                            </div>
                                        ) : (
                                            <>
                                                <Table>
                                                    {podsArray.length > 0 && (
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>{t("statefulPodManagement.resourceGroup")}</TableHead>
                                                                <TableHead>{t("statefulPodManagement.maxRent")}</TableHead>
                                                                <TableHead className="w-[100px]"></TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                    )}
                                                    <TableBody>
                                                        {podsArray?.map((pod) => (
                                                            <TableRow key={pod.id}>
                                                                <TableCell>{pod.resourceGroup?.name}</TableCell>
                                                                <TableCell>{pod.maxRent}</TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        disabled={isDeleting}
                                                                        onClick={() => handleClickPodDelete(pod.id!)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4"/>
                                                                        {t('statefulPodManagement.delete.button')}
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        {!podsArray?.length && (
                                                            <TableRow>
                                                                <TableCell colSpan={3}
                                                                           className="text-center text-muted-foreground py-4">
                                                                    {t('statefulPodManagement.noPods')}
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            <MaxRentModal
                open={showMaxRentModal}
                onOpenChange={setShowMaxRentModal}
                onSubmit={handleCreatePod}
            />

            <ConfirmationDialog
                name="deleteStatefulPod"
                header={t('statefulPodManagement.delete.confirmHeader')}
                text={t('statefulPodManagement.delete.confirmText')}
                onConfirm={() => handleConfirmPodDelete()}
            />
        </>
    )
}

export default StatefulPodDrawer