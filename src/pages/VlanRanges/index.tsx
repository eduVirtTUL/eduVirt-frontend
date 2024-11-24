import PageHeader from "@/components/PageHeader.tsx";
import {useDialog} from "@/stores/dialogStore.ts";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon, Undo2} from "lucide-react";
import CreateVlansRangeModal from "@/components/Modals/CreateVlansRangeModal.tsx";
import {useVlansRanges} from "@/data/network/useVlansRanges.ts";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useRemoveVlansRange} from "@/data/network/useRemoveVlansRange.ts";
import {Link} from "react-router-dom";

const VlanRangesPage: React.FC = () => {
    const {vlansRanges, isLoading} = useVlansRanges();
    const {open} = useDialog();
    const {removeVlansRangeAsync} = useRemoveVlansRange();

    const handleRemoveVlansRange = (async (vlansRangeId: string | undefined) => {
        if (typeof vlansRangeId === "string") {
            await removeVlansRangeAsync(vlansRangeId);
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
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
            <PageHeader title="VLAN ranges"/>
            <div className="pb-5">
                <Button
                    onClick={() => {
                        open("createVlansRange");
                    }}
                >
                    <PlusIcon/>
                    New VLANs range
                </Button>
            </div>

            <div className="flex flex-wrap gap-5 w-full">
                {(vlansRanges?.length == 0 ? [] : vlansRanges)?.map((vlansRange) => (
                    <Card key={vlansRange.id} className="w-80">
                        <CardHeader>
                            <CardTitle>Range</CardTitle>
                            <CardDescription>{vlansRange.from}-{vlansRange.to}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                onClick={() => {
                                    handleRemoveVlansRange(vlansRange.id)
                                }}>
                                Remove
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default VlanRangesPage;