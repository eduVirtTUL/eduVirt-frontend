import CreateCourseModal from "@/components/Modals/CreateCourseModal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCourses } from "@/data/course/useCourses";
import { useDialog } from "@/stores/dialogStore";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const CoursesPage: React.FC = () => {
  const { courses, isLoading } = useCourses();
  const { open } = useDialog();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateCourseModal />
      <PageHeader title="Courses" />
      <div className="pb-5">
        <Button
          onClick={() => {
            open("createCourse");
          }}
        >
          <PlusIcon />
          New course
        </Button>
      </div>

      <div className="flex flex-wrap gap-5 w-full">
        {courses?.map((course) => (
          <Card key={course.id} className="w-80">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link to={`/courses/${course.id}`}>View Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CoursesPage;
