import {useDialog} from "@/stores/dialogStore.ts";
import {useCreateMaintenanceInterval} from "@/data/maintenance/useCreateMaintenanceInterval.ts";
import {useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

type CreateMaintenanceIntervalModalProps = {
    clusterId: string | undefined,
    start: Date,
    end: Date,
    resetSelection: () => void,
}

const createMaintenanceIntervalSchema = z.object({
    cause: z.string(),
    description: z.string().optional(),
    duration: z.coerce.number().min(1).max(48),
});

type CreateMaintenanceIntervalSchema = z.infer<typeof createMaintenanceIntervalSchema>;

const CreateMaintenanceIntervalModal: React.FC<CreateMaintenanceIntervalModalProps> = ({
    clusterId, start, end, resetSelection
}) => {
    const {isOpen, close} = useDialog();
    const {createMaintenanceIntervalAsync} = useCreateMaintenanceInterval(clusterId);

    const form = useForm<CreateMaintenanceIntervalSchema>({
        resolver: zodResolver(createMaintenanceIntervalSchema),
        defaultValues: {
            cause: '',
            description: '',
            duration: 1
        }
    });

    useEffect(() => {
        if (start && end) {
            const calculatedDuration = (end.valueOf() - start.valueOf()) / (1000 * 60 * 60);
            form.reset({
                cause: '',
                description: '',
                duration: calculatedDuration >= 1 ? calculatedDuration : 1
            });
        }
    }, [start, end, form]);

    const handleSubmit = form.handleSubmit(async (values: CreateMaintenanceIntervalSchema) => {
        const startTime = new Date(start!);
        const tempDate = new Date(startTime);
        const endTime = new Date(tempDate.setHours(tempDate.getHours() + values.duration));

        console.log(start);
        console.log(end);

        const createDto = {
            cause: values.cause,
            description: values.description,
            beginAt: startTime.toISOString(),
            endAt: endTime.toISOString(),
        }

        await createMaintenanceIntervalAsync(createDto);
        close();
        form.reset();
    });

    return (
        <>
            <Dialog
                open={isOpen("createInterval")}
                onOpenChange={() => {
                    resetSelection();
                    close();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new maintenance interval</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="cause"
                                render={({field}) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel>Cause</FormLabel>
                                        <FormControl>
                                            <Input {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({field}) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel>Interval duration (h)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type={"number"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create interval</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateMaintenanceIntervalModal;