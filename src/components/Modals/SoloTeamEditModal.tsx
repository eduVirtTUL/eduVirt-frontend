import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateTeam } from "@/data/team/useUpdateTeam"

interface SoloTeamEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    team: {
        id: string;
        active: boolean;
    };
}

const soloTeamSchema = z.object({
    active: z.boolean()
});

export function SoloTeamEditModal({ open, onOpenChange, team }: SoloTeamEditModalProps) {
    const { updateTeam } = useUpdateTeam();

    const form = useForm<z.infer<typeof soloTeamSchema>>({
        resolver: zodResolver(soloTeamSchema),
        defaultValues: {
            active: team.active
        }
    });

    async function onSubmit(values: z.infer<typeof soloTeamSchema>) {
        await updateTeam({
            id: team.id,
            active: values.active
        });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Team Status</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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