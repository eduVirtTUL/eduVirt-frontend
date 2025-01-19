import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateTeam } from "@/data/team/useUpdateTeam"
import { CheckIcon, XCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface UserDto {
    id: string;
    name: string;
}

interface EditTeamModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    team: {
        id: string;
        name: string;
        maxSize: number;
        active: boolean;
        users: UserDto[];
        etag: string;
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
    const { t } = useTranslation();

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
            active: values.active,
            etag: team.etag
        });
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("editTeam.title")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("editTeam.name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t("editTeam.nameDescription")}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("editTeam.maxSize")}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min={minSize}
                                            {...field}
                                            onChange={e => field.onChange(+e.target.value)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t("editTeam.maxSizeDescription", { minSize })}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t("editTeam.active")}</FormLabel>
                                    <FormControl>
                                        <Switch 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t("editTeam.activeDescription")}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
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