import React from "react";
import {useDialog} from "@/stores/dialogStore.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useCreateVlansRange} from "@/data/network/useCreateVlansRange.ts";

const createVlansRangeSchema = z.object({
    from: z.coerce.number()
        .min(0)
        .max(4096),
    to: z.coerce.number()
        .min(0)
        .max(4096),
});

type CreateVlansRangeSchema = z.infer<typeof createVlansRangeSchema>;

const CreateVlansRangeModal: React.FC = () => {
    const {isOpen, close} = useDialog();
    const {createVlansRangeAsync} = useCreateVlansRange();

    const form = useForm<CreateVlansRangeSchema>({
        resolver: zodResolver(createVlansRangeSchema),
        defaultValues: {
            from: 0,
            to: 1,
        },
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        await createVlansRangeAsync(values);
        close();
        form.reset();
    });

    return (
        <Dialog
            open={isOpen("createVlansRange")}
            onOpenChange={() => {
                close();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a VLANs range</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <FormField
                            control={form.control}
                            name="from"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Range from</FormLabel>
                                    <FormControl>
                                        <Input {...field} type={"number"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="to"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Range to</FormLabel>
                                    <FormControl>
                                        <Input {...field} type={"number"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <br/>
                        <Button type="submit">Create VLANs range</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateVlansRangeModal;