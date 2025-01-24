import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateTeam } from "@/data/team/useUpdateTeam"
import { SaveIcon, XCircleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { t } from "i18next"

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
        users: UserDto[];
        etag: string;
    };
    existingNames: string[];
}

const editTeamSchema = z.object({
    name: z.string()
    .min(1, t("editTeam.validation.teamNameMin"))
    .max(50, t("editTeam.validation.teamNameMin"))
    // eslint-disable-next-line no-useless-escape
    .regex(/^[a-zA-Z0-9\_\-]*$/, t("editTeam.validation.teamNameRegex")),
    maxSize: z.number()
    .min(2, t("editTeam.validation.maxSizeMin"))
    .max(10, t("editTeam.validation.maxSizeMax"))
})

export function EditTeamModal({ open, onOpenChange, team, existingNames }: EditTeamModalProps) {
    const { updateTeam } = useUpdateTeam();
    const minSize = Math.max(2, team.users.length);
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof editTeamSchema>>({
        resolver: zodResolver(editTeamSchema),
        defaultValues: {
            name: team.name,
            maxSize: team.maxSize
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
                    <Button 
                        type="submit"
                        disabled={!form.formState.isDirty}
                    >
                        <SaveIcon />
                        {t("save")}
                    </Button>
                </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}