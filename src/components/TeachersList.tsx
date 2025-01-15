import { useGetTeachersForCourse } from "@/data/course/teachers/useGetTeachersForCourse";
import { useTranslation } from "react-i18next";
import { Skeleton } from "./ui/skeleton";

export function TeachersList({ courseId }: { courseId: string }) {
    const { teachers, isLoading } = useGetTeachersForCourse(courseId);
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[100px]"/>
            ))}
        </div>;
    }

    const teachersArray = Array.isArray(teachers) ? teachers : [];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {teachersArray.map(teacher => (
                <div
                    key={teacher.id}
                    className="flex items-center space-x-4 rounded-lg border p-4"
                >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg">
                            {teacher.firstName?.[0] || teacher.userName?.[0] || 'T'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                            {teacher.firstName && teacher.lastName
                                ? `${teacher.firstName} ${teacher.lastName}`
                                : teacher.userName || teacher.email}
                        </p>
                        {teacher.email && teacher.email !== teacher.userName && (
                            <p className="text-xs text-muted-foreground truncate">
                                {teacher.email}
                            </p>
                        )}
                    </div>
                </div>
            ))}
             {teachersArray.length === 0 && (
                <p className="text-muted-foreground text-center py-4 col-span-3">
                    {t("coursePageB.teachersCard.noTeachers")}
                </p>
            )}
        </div>
    );

}

export default TeachersList;

