import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Checkbox} from "@/components/ui/checkbox"
import {useState} from "react"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {useTeam} from "@/data/team/useTeam"
import {useCourseResourceGroupPools} from "@/data/rgPool/useCourseResourceGroupPools"
import {useStatelessPodsForTeam} from "@/data/pods/useStatelessPodsForTeam"
import {useCreateStatelessPod} from "@/data/pods/useCreateStatelessPod"
import {useDeleteStatelessPod} from "@/data/pods/useDeleteStatelessPod"
import {useDialog} from "@/stores/dialogStore"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import {PlusIcon, Trash2} from "lucide-react"
import {useTranslation} from "react-i18next"

interface StatelessPodDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teamId: string
    courseId: string
}

const StatelessPodDrawer = ({open, onOpenChange, teamId, courseId}: StatelessPodDrawerProps) => {
    const [selectedPool, setSelectedPool] = useState<string | null>(null)
    const {team, isLoading: isLoadingTeam} = useTeam(teamId)
    const {courseResourceGroupPools, isLoading: isLoadingPools} = useCourseResourceGroupPools(courseId)
    const {statelessPods = [], isLoading: isLoadingStateless} = useStatelessPodsForTeam(teamId)
    console.log(statelessPods)
    const {createStatelessPod} = useCreateStatelessPod()
    const {deleteStatelessPod, isPending: isDeleting} = useDeleteStatelessPod()
    const {open: openDialog} = useDialog()
    const [podToDelete, setPodToDelete] = useState<string | null>(null)
    const {t} = useTranslation()

    const podsArray = Array.isArray(statelessPods) ? statelessPods : []

    const isPoolAssigned = (poolId: string) => {
        return podsArray.some(pod => pod.resourceGroupPool?.id === poolId);
    };

    const handleSubmit = () => {
        if (selectedPool) {
            createStatelessPod({teamId, resourceGroupPoolId: selectedPool})
        }
    }

    const handleClickPodDelete = (podId: string) => {
        setPodToDelete(podId)
        openDialog("confirmation")
    }

    const handleConfirmPodDelete = () => {
        if (podToDelete) {
            deleteStatelessPod(podToDelete)
            setPodToDelete(null)
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[75vh]">
                <DrawerHeader>
                    <DrawerTitle>
                        {isLoadingTeam ? (
                            <Skeleton className="h-6 w-48"/>
                        ) : (
                            `${t("statelessPodManagement.title")} ${team?.name}`
                        )}
                    </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("statelessPodManagement.resourceGroupPools")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[50vh]">
                                    {isLoadingPools ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-12 w-full"/>
                                            <Skeleton className="h-12 w-full"/>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableBody>
                                                {courseResourceGroupPools?.map((pool) => (
                                                    <TableRow key={pool.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedPool === pool.id || isPoolAssigned(pool.id!)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setSelectedPool(pool.id!)
                                                                    } else {
                                                                        setSelectedPool(null)
                                                                    }
                                                                }}
                                                                disabled={isPoolAssigned(pool.id!)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <span>{pool.name}</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </ScrollArea>
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-32"
                                        disabled={!selectedPool}
                                    >
                                        <PlusIcon/>
                                        {t('statelessPodManagement.createPod')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("statelessPodManagement.teamPods")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[50vh]">
                                    {isLoadingStateless ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-12 w-full"/>
                                            <Skeleton className="h-12 w-full"/>
                                        </div>
                                    ) : (
                                        <Table>
                                            {podsArray.length > 0 && (
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>{t("statelessPodManagement.resourceGroupPool")}</TableHead>
                                                        <TableHead className="w-[100px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                            )}
                                            <TableBody>
                                                {podsArray?.map((pod) => (
                                                    <TableRow key={pod.id}>
                                                        <TableCell>
                                                            {courseResourceGroupPools?.find(p => p.id === pod.resourceGroupPool?.id)?.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={isDeleting}
                                                                onClick={() => handleClickPodDelete(pod.id!)}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                                {t("statelessPodManagement.delete.button")}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {!podsArray?.length && (
                                                    <TableRow>
                                                        <TableCell colSpan={3}
                                                                   className="text-center text-muted-foreground">
                                                            {t('statelessPodManagement.noPods')}
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
                header={t('statelessPodManagement.delete.confirmHeader')}
                text={t('statelessPodManagement.delete.confirmText')}
                onConfirm={handleConfirmPodDelete}
            />
        </Drawer>
    )
}

export default StatelessPodDrawer