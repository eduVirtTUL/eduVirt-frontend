import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {Plus} from "lucide-react";
import {useCreateTeam} from "@/data/team/useCreateTeam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, XCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {t} from "i18next";

interface CreateTeamModalProps {
    courseId: string;
}

const singleTeamSchema = z.object({
  teamName: z.string()
    .min(1, t("createTeam.validation.teamNameMin"))
    .max(50, t("createTeam.validation.teamNameMax"))
    .regex(/^[a-zA-Z0-9\s\-_]+$/, t("createTeam.validation.teamNameRegex")),
  key: z.string().min(4, t("createTeam.validation.keyMinLength")).max(20, t("createTeam.validation.keyMaxLength")).regex(/^[a-zA-Z0-9]+$/, t("createTeam.validation.keyRegex")),
  maxSize: z.number().min(2, t("createTeam.validation.maxSizeMin")).max(10, t("createTeam.validation.maxSizeMax"))
})

const bulkTeamSchema = z.object({
  baseTeamName: z.string()
    .min(1, t("createTeam.validation.baseTeamNameMin"))
    .max(40, t("createTeam.validation.baseTeamNameMax"))
    .regex(/^[a-zA-Z0-9\s\-_]+$/, t("createTeam.validation.teamNameRegex")),
  teamCount: z.number().min(2, t("createTeam.validation.teamCountMin")).max(10, t("createTeam.validation.teamCountMax")),
  maxSize: z.number().min(2, t("createTeam.validation.maxSizeMin")).max(10, t("createTeam.validation.maxSizeMax"))
})

type SingleTeamForm = z.infer<typeof singleTeamSchema>
type BulkTeamForm = z.infer<typeof bulkTeamSchema>

const CreateTeamModal = ({courseId}: CreateTeamModalProps) => {
  const [open, setOpen] = useState(false)
  const {createTeam} = useCreateTeam()
  const { t } = useTranslation();

  const generateUniqueKey = (teamName: string) => {
    const MAX_LENGTH = 20;
    const RANDOM_LENGTH = 8;
    const sanitizedName = teamName.toLowerCase().replace(/\s+/g, '-');
    const truncatedName = sanitizedName.slice(0, MAX_LENGTH - RANDOM_LENGTH - 1);
    const randomSuffix = Math.random().toString(36).substring(2, 2 + RANDOM_LENGTH);
    return `${truncatedName}-${randomSuffix}`;
};

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
      baseTeamName: "",
      teamCount: 2,
      maxSize: 3
    }
  })

  useEffect(() => {
    const teamName = singleForm.watch("teamName")
    if (teamName) {
      singleForm.setValue("key", generateUniqueKey(teamName))
    }
  }, [singleForm.watch("teamName")])

  const onSingleSubmit = (data: SingleTeamForm) => {
    createTeam({
      name: data.teamName,
      courseId: courseId,
      maxSize: data.maxSize,
      keyValue: data.key,
    })
    setOpen(false)
    singleForm.reset()
  }

  const onBulkSubmit = (data: BulkTeamForm) => {
    const teams = Array.from({length: data.teamCount}, (_, i) => ({
      name: `${data.baseTeamName} ${i + 1}`,
      courseId: courseId,
      maxSize: data.maxSize,
      keyValue: generateUniqueKey(`${data.baseTeamName} ${i + 1}`),
    }))
    teams.forEach(team => createTeam(team))
    setOpen(false)
    bulkForm.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
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
              <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-6">
                <FormField
                  control={singleForm.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createTeam.name')}</FormLabel>
                      <FormControl>
                        <Input {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={singleForm.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createTeam.key')}</FormLabel>
                      <FormControl>
                        <Input {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={singleForm.control}
                  name="maxSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createTeam.maxSize')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={2}
                          max={15}
                          {...field} 
                          onChange={e => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
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
                    <XCircleIcon />
                    {t("cancel")}
                  </Button>
                  <Button type="submit">
                    <CheckIcon />
                    {t("create")}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk">
            <Form {...bulkForm}>
              <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-6">
                <FormField
                  control={bulkForm.control}
                  name="baseTeamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createTeam.baseTeamName')}</FormLabel>
                      <FormControl>
                        <Input {...field}/>
                      </FormControl>
                      <FormDescription>
                        {t('createTeam.baseTeamNameDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={bulkForm.control}
                  name="teamCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createTeam.teamCount')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={2}
                          max={15}
                          {...field} 
                          onChange={e => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={bulkForm.control}
                  name="maxSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createTeam.maxSize')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={2}
                          max={8}
                          {...field} 
                          onChange={e => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
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
                    <XCircleIcon />
                    {t("cancel")}
                  </Button>
                  <Button type="submit">
                    <CheckIcon />
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