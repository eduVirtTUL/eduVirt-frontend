import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {Plus} from "lucide-react";
import {useCreateTeam} from "@/data/team/useCreateTeam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateTeamModalProps {
    courseId: string;
}

const singleTeamSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  key: z.string().min(4).max(16),
  maxSize: z.number().min(1).max(10)
})

const bulkTeamSchema = z.object({
  baseTeamName: z.string().min(1, "Base team name is required"),
  teamCount: z.number().min(2).max(15),
  maxSize: z.number().min(1).max(8)
})

type SingleTeamForm = z.infer<typeof singleTeamSchema>
type BulkTeamForm = z.infer<typeof bulkTeamSchema>

const CreateTeamModal = ({courseId}: CreateTeamModalProps) => {
  const [open, setOpen] = useState(false)
  const {createTeam} = useCreateTeam()

  const generateUniqueKey = (teamName: string) => {
    const MAX_LENGTH = 20;
    const RANDOM_LENGTH = 4;
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
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Creation</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Team</TabsTrigger>
            <TabsTrigger value="bulk">Multiple Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Form {...singleForm}>
              <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4">
                <FormField
                  control={singleForm.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter team name..."/>
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
                      <FormLabel>Team Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter team key..."/>
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
                      <FormLabel>Max Team Size</FormLabel>
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
                <Button type="submit" className="w-full">Create Team</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk">
            <Form {...bulkForm}>
              <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-4">
                <FormField
                  control={bulkForm.control}
                  name="baseTeamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Team Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Base team name (e.g. 'Team')"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={bulkForm.control}
                  name="teamCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Teams</FormLabel>
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
                      <FormLabel>Max Team Size</FormLabel>
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
                <div className="text-sm text-muted-foreground">
                  Teams will be created as: "{bulkForm.watch("baseTeamName")}1", "{bulkForm.watch("baseTeamName")}2", etc.
                </div>
                <Button type="submit" className="w-full">Create Teams</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTeamModal;