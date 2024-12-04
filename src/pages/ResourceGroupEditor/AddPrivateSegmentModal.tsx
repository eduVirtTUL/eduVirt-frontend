import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddResourceGroupNetwork } from "@/data/resourceGroup/useAddResourceGroupNetwork";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AddPrivateSegmentModalProps = {
  id: string;
};

const createSegmentSchema = z.object({
  name: z.string().min(1),
});

type CreateSegmentForm = z.infer<typeof createSegmentSchema>;

const AddPrivateSegmentModal: React.FC<AddPrivateSegmentModalProps> = ({
  id,
}) => {
  const { addNetwork } = useAddResourceGroupNetwork(id);

  const form = useForm<CreateSegmentForm>({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    addNetwork(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create new segment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new private segment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPrivateSegmentModal;
