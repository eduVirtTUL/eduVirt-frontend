import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateTeam } from "@/data/team/useUpdateTeam"

interface EditTeamModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    team: {
        id: string;
        name: string;
        maxSize: number;
        active: boolean;
        users: string[];
    };
    existingNames: string[];
}

const editTeamSchema = z.object({
    name: z.string().min(1, "Team name is required"),
    maxSize: z.number().min(2, "Team size must be at least 2"),
    active: z.boolean()
})

export function EditTeamModal({ open, onOpenChange, team, existingNames }: EditTeamModalProps) {
    const { updateTeam } = useUpdateTeam();
    const minSize = Math.max(2, team.users.length);

    const form = useForm<z.infer<typeof editTeamSchema>>({
        resolver: zodResolver(editTeamSchema),
        defaultValues: {
            name: team.name,
            maxSize: team.maxSize,
            active: team.active
        }
    });

    async function onSubmit(values: z.infer<typeof editTeamSchema>) {
        if (values.name !== team.name && existingNames.includes(values.name)) {
            form.setError("name", { message: "Team name already exists" });
            return;
        }

        if (values.maxSize < minSize) {
            form.setError("maxSize", { 
                message: `Size cannot be less than ${minSize} (current user count)` 
            });
            return;
        }

        await updateTeam({
            id: team.id,
            name: values.name,
            maxSize: values.maxSize,
            active: values.active
        });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Team</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-bold">Max Size</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min={minSize}
                                            {...field}
                                            onChange={e => field.onChange(+e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <FormLabel>Active</FormLabel>
                                    <FormControl>
                                        <Switch 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}