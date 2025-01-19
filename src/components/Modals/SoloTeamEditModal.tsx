import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateTeam } from "@/data/team/useUpdateTeam"
import { CheckIcon, XCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface SoloTeamEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    team: {
        id: string;
        active: boolean;
        etag: string;
    };
}

const soloTeamSchema = z.object({
    active: z.boolean()
});

export function SoloTeamEditModal({ open, onOpenChange, team }: SoloTeamEditModalProps) {
    const { updateTeam } = useUpdateTeam();
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof soloTeamSchema>>({
        resolver: zodResolver(soloTeamSchema),
        defaultValues: {
            active: team.active
        }
    });

    async function onSubmit(values: z.infer<typeof soloTeamSchema>) {
        await updateTeam({
            id: team.id,
            active: values.active,
            etag: team.etag
        });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("soloTeamEdit.title")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t("soloTeamEdit.active")}</FormLabel>
                                    <FormControl>
                                        <Switch 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t("soloTeamEdit.activeDescription")}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                            >
                                <XCircleIcon />
                                {t("cancel")}
                            </Button>
                            <Button type="submit">
                                <CheckIcon />
                                {t("save")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}