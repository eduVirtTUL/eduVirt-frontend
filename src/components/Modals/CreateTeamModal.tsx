import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {CheckIcon, Plus, XCircleIcon} from "lucide-react";
import {useCreateTeam} from "@/data/team/useCreateTeam";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {z} from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslation} from "react-i18next";
import {t} from "i18next";
import {useCreateBatchTeams} from "@/data/team/useCreateBatchTeams";

interface CreateTeamModalProps {
    courseId: string;
}

const singleTeamSchema = z.object({
    teamName: z.string()
        .min(1, t("createTeam.validation.teamNameMin"))
        .max(50, t("createTeam.validation.teamNameMax"))
        // eslint-disable-next-line no-useless-escape
        .regex(/^[a-zA-Z0-9\s\_\-]+$/, t("createTeam.validation.teamNameRegex")),
    key: z.string()
        .min(4, t("createTeam.validation.keyMinLength"))
        .max(20, t("createTeam.validation.keyMaxLength"))
        // eslint-disable-next-line no-useless-escape
        .regex(/^[a-zA-Z0-9\_\-]*$/, t("createTeam.validation.keyRegex"))
        .optional()
        .or(z.literal('')),
    maxSize: z.number()
        .min(2, t("createTeam.validation.maxSizeMin"))
        .max(10, t("createTeam.validation.maxSizeMax"))
})


const bulkTeamSchema = z.object({
    prefix: z.string()
        .min(1, t("createTeam.validation.prefixMin"))
        .max(40, t("createTeam.validation.prefixMax"))
        .regex(/^[A-Za-z0-9-]+$/, t("createTeam.validation.prefixRegex")),
    numberOfTeams: z.number()
        .min(2, t("createTeam.validation.teamCountMin"))
        .max(15, t("createTeam.validation.teamCountMax")),
    teamSize: z.number()
        .min(2, t("createTeam.validation.maxSizeMin"))
        .max(8, t("createTeam.validation.maxSizeMax"))
})


type SingleTeamForm = z.infer<typeof singleTeamSchema>
type BulkTeamForm = z.infer<typeof bulkTeamSchema>

const CreateTeamModal = ({courseId}: CreateTeamModalProps) => {
    const [open, setOpen] = useState(false)
    const {createTeam} = useCreateTeam()
    const {createBatchTeams} = useCreateBatchTeams();
    const {t} = useTranslation();

    const singleForm = useForm<SingleTeamForm>({
        resolver: zodResolver(singleTeamSchema),
        defaultValues: {
            teamName: "",
            key: "",
            maxSize: 3
        }
    })

    const bulkForm = useForm<BulkTeamForm>({
        resolver: zodResolver(bulkTeamSchema),
        defaultValues: {
            prefix: "",
            numberOfTeams: 2,
            teamSize: 3
        }
    })

    const onSingleSubmit = (data: SingleTeamForm) => {
        createTeam({
            name: data.teamName,
            courseId: courseId,
            maxSize: data.maxSize,
            keyValue: data.key || "",
        })
        setOpen(false)
        singleForm.reset()
    }

    const onBulkSubmit = async (data: BulkTeamForm) => {
        await createBatchTeams({
            courseId,
            prefix: data.prefix,
            teamSize: data.teamSize,
            numberOfTeams: data.numberOfTeams
        });
        setOpen(false);
        bulkForm.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="h-4 w-4"/>
                    {t("coursePageB.teamsTable.createTeam")}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('createTeam.title')}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="single">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">{t('createTeam.singleTab')}</TabsTrigger>
                        <TabsTrigger value="bulk">{t('createTeam.bulkTab')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single">
                        <Form {...singleForm}>
                                        <FormDescription>{t("requiredFieldDescription")}</FormDescription>
                            
                            <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={singleForm.control}
                                    name="teamName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t('createTeam.name')}*</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={singleForm.control}
                                    name="key"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t('createTeam.key')}</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
                                            </FormControl>
                                            <FormDescription>{t('createTeam.keyDescription')}</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={singleForm.control}
                                    name="maxSize"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t('createTeam.maxSize')}*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={2}
                                                    max={15}
                                                    {...field}
                                                    onChange={e => field.onChange(+e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-row justify-between">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            singleForm.reset();
                                            setOpen(false);
                                        }}
                                    >
                                        <XCircleIcon/>
                                        {t("cancel")}
                                    </Button>
                                    <Button type="submit">
                                        <CheckIcon/>
                                        {t("create")}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="bulk">
                        <Form {...bulkForm}>
                        <FormDescription>{t("requiredFieldDescription")}</FormDescription>
                        <FormDescription className="mt-2">{t("createTeam.keyCreatedAutomatically")}</FormDescription>

                            <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-6 mt-4">
                                <FormField
                                    control={bulkForm.control}
                                    name="prefix"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t('createTeam.prefix')}*</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
                                            </FormControl>
                                            <FormDescription>
                                                {t('createTeam.prefixDescription')}
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={bulkForm.control}
                                    name="numberOfTeams"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t('createTeam.teamCount')}*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={2}
                                                    max={15}
                                                    {...field}
                                                    onChange={e => field.onChange(+e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={bulkForm.control}
                                    name="teamSize"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>{t('createTeam.maxSize')}*</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={2}
                                                    max={8}
                                                    {...field}
                                                    onChange={e => field.onChange(+e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-row justify-between">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            bulkForm.reset();
                                            setOpen(false);
                                        }}
                                    >
                                        <XCircleIcon/>
                                        {t("cancel")}
                                    </Button>
                                    <Button type="submit">
                                        <CheckIcon/>
                                        {t("create")}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTeamModal;