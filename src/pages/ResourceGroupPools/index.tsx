import PageHeader from "@/components/PageHeader";
import { useResourceGroupPools } from "@/data/rgPool/useResourceGroupPools";
import React from "react";
import { useTranslation } from "react-i18next";

const ResourceGroupPoolsPage: React.FC = () => {
  const { t } = useTranslation();
  const { resourceGroupPools } = useResourceGroupPools();
  return (
    <>
      <PageHeader title={t("resourceGroupPools.title")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resourceGroupPools?.map((pool) => (
          <div key={pool.id} className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold">{pool.name}</h2>
            <div className="mt-4">
              <p>{pool.name}</p>
              <p>{pool.course?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResourceGroupPoolsPage;
