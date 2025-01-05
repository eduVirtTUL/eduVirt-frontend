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
// import { useDeleteStatelessPod } from "@/data/pods/useDeleteStatelessPod"
import {useDialog} from "@/stores/dialogStore"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import {Trash2} from "lucide-react"
import { useDeleteStatelessPod } from "@/data/pods/useDeleteStatelessPod"

interface StatelessPodDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teamId: string
    courseId: string
}

interface StatelessPod {
    poolId: string;
    teamId: string;
    poolName?: string;
}

const StatelessPodDrawer = ({open, onOpenChange, teamId, courseId}: StatelessPodDrawerProps) => {
    const [selectedPool, setSelectedPool] = useState<string | null>(null)
    const {team, isLoading: isLoadingTeam} = useTeam(teamId)
    const {courseResourceGroupPools, isLoading: isLoadingPools} = useCourseResourceGroupPools(courseId)
    const {pods: statelessPods, isLoading: isLoadingStateless} = useStatelessPodsForTeam(teamId) as { pods: string[], isLoading: boolean }
    console.log(statelessPods)
    const {createStatelessPod} = useCreateStatelessPod()
    const { deleteStatelessPod, isPending: isDeleting } = useDeleteStatelessPod()
    const {open: openDialog} = useDialog()
    const [podToDelete, setPodToDelete] = useState<string | null>(null)

    const handleSubmit = () => {
        createStatelessPod({teamId, resourceGroupPoolId: selectedPool!})
        onOpenChange(false)
    }

    const handleClickPodDelete = (podId: string) => {
        setPodToDelete(podId)
        openDialog("confirmation")
    }

    const handleConfirmPodDelete = () => {
        if (podToDelete) {
            // deleteStatelessPod(podToDelete)
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
                            `Stateless Pod Management - Team ${team?.name}`
                        )}
                    </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resource Group Pools</CardTitle>
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
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Name</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {courseResourceGroupPools?.map((pool) => (
                                                    <TableRow key={pool.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedPool === pool.id}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setSelectedPool(pool.id!)
                                                                    } else {
                                                                        setSelectedPool(null)
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{pool.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </ScrollArea>
                                <div className="flex justify-center mt-4">
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-32"
                                        disabled={!selectedPool}
                                    >
                                        Create Pod
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Team's Pods</CardTitle>
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
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead></TableHead>
                                                    <TableHead>Pool Name</TableHead>
                                                    <TableHead className="w-[100px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                            {statelessPods?.map((pod: StatelessPod, index) => (
                                                    <TableRow key={`${pod.poolId}-${pod.teamId}`}>
                                                    <TableCell>{`${index + 1}.`}</TableCell>
                                                    <TableCell>
                                                        {courseResourceGroupPools?.find(p => p.id === pod.poolId)?.name || 'Unknown Pool'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={isDeleting}
                                                            onClick={() => handleClickPodDelete(pod.poolId)}
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                ))}
                                                {!statelessPods?.length && (
                                                    <TableRow>
                                                        <TableCell colSpan={3}
                                                                   className="text-center text-muted-foreground">
                                                            No pods found
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
                header="Delete Pod"
                text="Are you sure you want to delete this pod?"
                onConfirm={handleConfirmPodDelete}
            />
        </Drawer>
    )
}

export default StatelessPodDrawer