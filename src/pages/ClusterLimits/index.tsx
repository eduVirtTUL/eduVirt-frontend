import {useParams} from "react-router";
import React from "react";
import ClusterDetails from "@/pages/Clusters/ClusterDetails.tsx";
import ClusterMetricsList from "@/pages/ClusterLimits/ClusterMetricsList.tsx";
import {Card} from "@/components/ui/card.tsx";

const ClusterLimitsPage: React.FC = () => {
    const {id} = useParams();

    return (
        <>
            <div className="flex justify-between">
                <Card className="w-1/2 p-4 h-screen my-auto">
                    <ClusterDetails clusterId={id!}/>
                </Card>
                <Card className="w-1/2 p-4 h-screen my-auto">
                    <ClusterMetricsList />
                </Card>
            </div>
        </>
    );
};

export default ClusterLimitsPage;
