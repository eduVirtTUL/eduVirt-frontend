import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {CheckIcon, XCircleIcon} from "lucide-react"
import {useTranslation} from "react-i18next"
import {t} from "i18next";
import {useJoinTeamOrCourse} from "@/data/team/users/useJoinTeamOrCourse";

const joinTeamSchema = z.object({
    teamKey: z.string().min(4, t("joinTeam.validation.keyMinLength")).max(20, t("joinTeam.validation.keyMaxLength")).regex(/^[a-zA-Z0-9\s\-_]+$/, t("joinTeam.validation.keyRegex"))
});

const JoinTeamModal = () => {
    const [open, setOpen] = useState(false);
    const {joinTeam} = useJoinTeamOrCourse();
    const {t} = useTranslation();

    const form = useForm<z.infer<typeof joinTeamSchema>>({
        resolver: zodResolver(joinTeamSchema),
        defaultValues: {
            teamKey: ""
        }
    });

    const onSubmit = (values: z.infer<typeof joinTeamSchema>) => {
        joinTeam(values.teamKey);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("joinTeam.button")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("joinTeam.title")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="teamKey"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t("joinTeam.keyLabel")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t("joinTeam.keyDescription")}
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setOpen(false)}
                            >
                                <XCircleIcon/>
                                {t("cancel")}
                            </Button>
                            <Button type="submit">
                                <CheckIcon/>
                                {t("join")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default JoinTeamModal;