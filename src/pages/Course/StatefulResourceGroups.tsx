import CreateResourceGroupModal from "@/components/Modals/CreateResourceGroupModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateStatefulResourceGroup } from "@/data/course/resourceGroups/useCreateStatefulResourceGroup";
import { useStatefulResourceGroups } from "@/data/course/resourceGroups/useStatefulResourceGroups";
import { useDialog } from "@/stores/dialogStore";
import { PlusIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type StatefulResourceGroupsProps = {
  courseId: string;
};

const StatefulResourceGroups: React.FC<StatefulResourceGroupsProps> = ({
  courseId,
}) => {
  const { t } = useTranslation();
  const { open } = useDialog();
  const { statefulResourceGroups } = useStatefulResourceGroups(courseId);
  const { createResourceGroupAsync } = useCreateStatefulResourceGroup();

  return (
    <>
      <CreateResourceGroupModal
        onCreate={async (data) => {
          await createResourceGroupAsync({ id: courseId, ...data });
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>{t("courseStatefulResourceGroups.title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row">
            <Button onClick={() => open("createResourceGroup")}>
              <PlusIcon />
              {t("courseStatefulResourceGroups.createResourceGroup")}
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {statefulResourceGroups?.map((rg) => (
              <Card key={rg.id}>
                <CardHeader>
                  <CardTitle>{rg.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link to={`/rg/${rg.id}`}>
                      {t("courseStatefulResourceGroups.openEditor")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatefulResourceGroups;
