import PageHeader from "@/components/PageHeader";
import { useDialog } from "@/stores/dialogStore";
import { Button } from "@/components/ui/button";
import { LoaderIcon, PlusIcon, Undo2 } from "lucide-react";
import CreateVlansRangeModal from "@/components/Modals/CreateVlansRangeModal";
import { useVlansRanges } from "@/data/network/vlan/useVlansRanges";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRemoveVlansRange } from "@/data/network/vlan/useRemoveVlansRange";
import { Link } from "react-router";
import React from "react";

const VlanRangesPage: React.FC = () => {
  const { vlansRanges, isLoading } = useVlansRanges();
  const { open } = useDialog();
  const { removeVlansRangeAsync } = useRemoveVlansRange();

  const handleRemoveVlansRange = async (vlansRangeId?: string) => {
    if (vlansRangeId) {
      await removeVlansRangeAsync(vlansRangeId);
    }
  };

  if (isLoading) {
    return <LoaderIcon className="animate-spin size-10" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateVlansRangeModal />
      <div>
        <Button asChild variant="outline" size="icon">
          <Link to={"/networks"}>
            <Undo2 />
          </Link>
        </Button>
      </div>
      <PageHeader title="VLAN ranges" />
      <div className="pb-5">
        <Button
          onClick={() => {
            open("createVlansRange");
          }}
        >
          <PlusIcon />
          New VLANs range
        </Button>
      </div>

      <div className="flex flex-wrap gap-5 w-full">
        {(vlansRanges?.length ? vlansRanges : [])?.map((vlansRange) => (
          <Card key={vlansRange.id} className="w-80">
            <CardHeader>
              <CardTitle>Range</CardTitle>
              <CardDescription>
                {vlansRange.from}-{vlansRange.to}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => handleRemoveVlansRange(vlansRange.id)}>
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
