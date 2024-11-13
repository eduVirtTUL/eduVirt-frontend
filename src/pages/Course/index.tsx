import CreatePoolModal from "@/components/Modals/CreatePoolModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/data/course/useCourse";
import { useCourseResourceGroupPools } from "@/data/rgPool/useCourseResourceGroupPools";
import { useDialog } from "@/stores/dialogStore";
import React from "react";
import { useParams } from "react-router-dom";

const CoursePage: React.FC = () => {
  const { id } = useParams();
  const { course } = useCourse(id!);
  const { open } = useDialog();
  const { courseResourceGroupPools } = useCourseResourceGroupPools(id!);
  return (
    <>
      <CreatePoolModal courseId={id!} />
      <PageHeader title={course?.name ?? ""} />
      <p>Welcome to the course page!</p>
      {course?.name}
      <Button onClick={() => open("createPool")}>Add pool</Button>
      {courseResourceGroupPools?.map((pool) => (
        <div key={pool.id}>{pool.name}</div>
      ))}
    </>
  );
};

export default CoursePage;
