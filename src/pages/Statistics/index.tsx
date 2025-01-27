import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./Overview";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

import { t } from "i18next";
import PageHeader from "@/components/PageHeader";
import { useCourseStats } from "@/data/statistics/useStats";

export const StatisticsPage = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: courseStats, isLoading } = useCourseStats(courseId!);

  if (isLoading) {
    return <StatisticsLoader />;
  }
  
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader 
          title={courseStats?.courseName ?? ""} 
          type={t("statistics.title")} 
        />
        <Button variant="outline" onClick={() => navigate(-1)}>
          <Undo2 className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>

      <div className="container mx-auto py-4 space-y-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t("statistics.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="teams">{t("statistics.tabs.teams")}</TabsTrigger>
            <TabsTrigger value="resources">{t("statistics.tabs.resources")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {courseStats && <Overview data={courseStats} />}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const StatisticsLoader = () => (
  <div className="container mx-auto py-6 space-y-6">
    <Skeleton className="h-10 w-[300px]" />
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  </div>
);

export default StatisticsPage;

export const handle = {
  roles: ["administrator", "teacher"],
};