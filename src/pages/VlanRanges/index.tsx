import PageHeader from "@/components/PageHeader";
import {useDialog} from "@/stores/dialogStore";
import {Button} from "@/components/ui/button";
import {PlusIcon, Undo2} from "lucide-react";
import CreateVlansRangeModal from "@/components/Modals/CreateVlansRangeModal";
import {useVlansRanges} from "@/data/network/vlan/useVlansRanges";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {useRemoveVlansRange} from "@/data/network/vlan/useRemoveVlansRange";
import {Link} from "react-router";
import React from "react";
import {RouteHandle} from "@/AuthGuard";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
import BounceLoader from "react-spinners/BounceLoader";

const VlanRangesPage: React.FC = () => {
    const {t} = useTranslation();

    const {vlansRanges, isLoading} = useVlansRanges();
    const {open} = useDialog();
    const {removeVlansRangeAsync} = useRemoveVlansRange();

    const handleRemoveVlansRange = async (vlansRangeId?: string) => {
        if (vlansRangeId) {
            await removeVlansRangeAsync(vlansRangeId);
        }
    };

    if (isLoading) {
        return (
            <>
                <CreateVlansRangeModal/>

                <div>
                    <Button asChild variant="outline" size="icon">
                        <Link to={"/networks"}>
                            <Undo2/>
                        </Link>
                    </Button>
                </div>

                <PageHeader title={t("vlansRange.title")}/>

                <div className="pb-5">
                    <Button
                        onClick={() => {
                            open("createVlansRange");
                        }}
                    >
                        <PlusIcon/>
                        {t("vlansRange.createButton")}
                    </Button>
                </div>

                <div className="flex justify-center items-center min-h-hull">
                    <BounceLoader color="#1e1e1e"/>
                </div>
            </>
        );
    }

    return (
        <>
            <CreateVlansRangeModal/>

            <div>
                <Button asChild variant="outline" size="icon">
                    <Link to={"/networks"}>
                        <Undo2/>
                    </Link>
                </Button>
            </div>

            <PageHeader title={t("vlansRange.title")}/>

            <div className="pb-5">
                <Button
                    onClick={() => {
                        open("createVlansRange");
                    }}
                >
                    <PlusIcon/>
                    {t("vlansRange.createButton")}
                </Button>
            </div>

            <div className="flex flex-wrap gap-5 w-full">
                {(vlansRanges?.length ? vlansRanges : [])?.map((vlansRange) => (
                    <Card key={vlansRange.id} className="w-80">
                        <CardHeader>
                            <CardTitle>{t("vlansRange.unitName")}</CardTitle>
                            <CardDescription>
                                {vlansRange.from}-{vlansRange.to}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={() => handleRemoveVlansRange(vlansRange.id)}>
                                {t("vlansRange.removeButton")}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default VlanRangesPage;

export const handle: RouteHandle = {
    roles: ["administrator"],
};

export const meta = () => {
    return [{ title: i18next.t("pageTitles.vlansRanges") }];
};