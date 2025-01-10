import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Checkbox} from "@/components/ui/checkbox"
import {useState} from "react"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {useResourceGroups} from "@/data/resourceGroup/useResourceGroups"
import {useStatefulPodsForTeam} from "@/data/pods/useStatefulPodsForTeam"
import {useResourceGroupVms} from "@/data/resourceGroup/useResourceGroupVms"
import {AlertTriangle, ChevronDown, ChevronRight, Trash2} from "lucide-react"
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {useResourceGroupsWithPods} from "@/data/resourceGroup/useResourceGroupsWithPods"
import {ResourceGroupDto} from "@/api"
import {useTeam} from "@/data/team/useTeam"
import {useCreateStatefulPod} from "@/data/pods/useCreateStatefulPod"
import {useDeleteStatefulPod} from "@/data/pods/useDeleteStatefulPod"
import {useDialog} from "@/stores/dialogStore"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import { useTranslation } from "react-i18next"

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
    const { t } = useTranslation();

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
                        {(!isLoading && hasPod) && (
                            <AlertTriangle className="h-4 w-4"/>
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
                                <AlertTriangle className="h-4 w-4"/>
                                <div>{t("podManagement.alerts.hasAssociatedPod")}</div>
                            </div>
                        )}
                        {isLoading ? (
                            <Skeleton className="h-12 w-full"/>
                        ) : (
                            (vms ?? []).length === 0 ? (
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-500"/>
                                    <div className="text-orange-500">{t("podManagement.alerts.noVMs")}</div>
                                </div>
                            ) : (
                                (vms ?? []).map(vm => (
                                    <div key={vm.id} className="flex items-center gap-2">
                                        <Badge variant="secondary">{vm.name}</Badge>
                                        <Badge variant="outline">{vm.cpuCount} vCPU</Badge>
                                        <Badge variant="outline">{vm.memory} MiB</Badge>
                                        <Badge variant="outline">{(vm.nics ?? []).length} NICs</Badge>
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

const StatefulPodDrawer = ({open, onOpenChange, teamId}: StatefulPodDrawerProps) => {
    const {statefulPods = [], isLoading: isLoadingStateful} = useStatefulPodsForTeam(teamId)
    const {team, isLoading: isLoadingTeam} = useTeam(teamId)
    const [selectedResource, setSelectedResource] = useState<string | null>(null)
    const {resourceGroups, isLoading: isLoadingRG} = useResourceGroups()
    const {createStatefulPod} = useCreateStatefulPod()
    const {resourceGroupsWithPods} = useResourceGroupsWithPods()
    const {deleteStatefulPod, isPending: isDeleting} = useDeleteStatefulPod()
    const {open: openDialog} = useDialog()
    const [podToDelete, setPodToDelete] = useState<string | null>(null);
    const { t } = useTranslation();

    const podsArray = Array.isArray(statefulPods) ? statefulPods : []; // To assure that statefulPods is an array when 204 response is returned

    const handleSubmit = () => {
        createStatefulPod({teamId, resourceGroupId: selectedResource!})
        open = false
    }

    const handleClickPodDelete = (podId: string) => {
        setPodToDelete(podId);
        openDialog("confirmation");
    };

    const handleConfirmPodDelete = () => {
        if (podToDelete) {
            deleteStatefulPod(podToDelete);
            setPodToDelete(null);
        }
    }

    const hasAssignedPod = (rgId: string) => {
        return resourceGroupsWithPods?.some(rg => rg.id === rgId) ?? false;
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[75vh]">
                <DrawerHeader>
                    <DrawerTitle>
                        {isLoadingTeam ? (
                            <Skeleton className="h-6 w-48"/>
                        ) : (
                            `${t("podManagement.title")} ${team?.name}`
                        )}
                    </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('podManagement.resourceGroups')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[50vh]">
                                    {isLoadingRG ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-12 w-full"/>
                                            <Skeleton className="h-12 w-full"/>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Name</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {resourceGroups?.filter(rg => !rg.stateless).map((rg) => (
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
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </ScrollArea>
                                <div className="flex justify-center mt-4">
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-32"
                                        disabled={!selectedResource}
                                    >
                                        {t('podManagement.createPod')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("podManagement.teamPods")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[50vh]">
                                    {isLoadingStateful ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-12 w-full"/>
                                            <Skeleton className="h-12 w-full"/>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead></TableHead>
                                                    <TableHead>{t("podManagement.resourceGroup")}</TableHead>
                                                    <TableHead className="w-[100px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {podsArray?.map((pod, index) => (
                                                    <TableRow key={pod.id}>
                                                        <TableCell>{`${index + 1}.`}</TableCell>
                                                        <TableCell>{pod.resourceGroup?.name}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={isDeleting}
                                                                onClick={() => handleClickPodDelete(pod.id!)}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {!podsArray?.length && (
                                                    <TableRow>
                                                        <TableCell colSpan={3}
                                                                   className="text-center text-muted-foreground">
                                                            {t('podManagement.noPods')}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DrawerContent>
            <ConfirmationDialog
                header={t('podManagement.delete.confirmHeader')}
                text={t('podManagement.delete.confirmText')}
                onConfirm={() => handleConfirmPodDelete()}
            />
        </Drawer>
    )
}

export default StatefulPodDrawer