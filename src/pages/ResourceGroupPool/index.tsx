import PageHeader from "@/components/PageHeader";
import { useResourceGroupPool } from "@/data/rgPool/useResourceGroupPool";
import { useParams } from "react-router";

const ResourceGroupPoolPage: React.FC = () => {
  const { id } = useParams();

  const { resourceGroupPool } = useResourceGroupPool(id!);

  return (
    <>
      <PageHeader title={resourceGroupPool?.name ?? ""} />
    </>
  );
};

export default ResourceGroupPoolPage;
