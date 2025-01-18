import React from "react";
import {useDialog} from "@/stores/dialogStore";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useCreateVlansRange} from "@/data/network/vlan/useCreateVlansRange";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

const createVlansRangeSchema = (t: TFunction) =>
    z.object({
        from: z.coerce.number()
            .min(0, t("createVlansRangeModal.validation.range.belowLimit"))
            .max(4096, t("createVlansRangeModal.validation.range.aboveLimit")),
        to: z.coerce.number()
            .min(0, t("createVlansRangeModal.validation.range.belowLimit"))
            .max(4096, t("createVlansRangeModal.validation.range.aboveLimit"))
    });

type CreateVlansRangeSchema = z.infer<ReturnType<typeof createVlansRangeSchema>>;

const CreateVlansRangeModal: React.FC = () => {
    const {t} = useTranslation();
    const {isOpen, close} = useDialog();
    const {createVlansRangeAsync} = useCreateVlansRange();

    const form = useForm<CreateVlansRangeSchema>({
        resolver: zodResolver(createVlansRangeSchema(t)),
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
                    <DialogTitle>{t("createVlansRangeModal.title")}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <FormField
                            control={form.control}
                            name="from"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t("createVlansRangeModal.range.start")}</FormLabel>
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
                                    <FormLabel>{t("createVlansRangeModal.range.end")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} type={"number"}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <br/>
                        <Button type="submit">{t("createVlansRangeModal.actionButton")}</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateVlansRangeModal;
