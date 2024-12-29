import React from "react";
import { Route } from "./+types/index";
import { useCourse } from "@/data/course/useCourse";
import PageHeader from "@/components/PageHeader";
import CreateCourseMetricValueModal from "@/components/Modals/CreateCourseMetricValue";
import { useDialog } from "@/stores/dialogStore";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MetricValueDto } from "@/api";
import DataTable from "@/components/DataTable";
import { useCourseMetrics } from "@/data/course/metrics/useCourseMetrics";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteCourseMetric } from "@/data/course/metrics/useDeleteCourseMetric";
import EditCourseMetricValue from "@/components/Modals/EditCourseMetricValue";

const columns = (
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<MetricValueDto>[] => [
  { header: "Name", accessorKey: "name" },
  { header: "Value", accessorKey: "value" },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                onEdit(course.id ?? "");
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onDelete(course.id ?? "");
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const CourseLimits: React.FC<Route.ComponentProps> = ({ params: { id } }) => {
  const { open } = useDialog();
  const { course } = useCourse(id);
  const { courseMetrics } = useCourseMetrics(id);
  const { deleteCourseMetricAsync } = useDeleteCourseMetric();
  const deleteId = React.useRef<string>();
  const [editId, setEditId] = React.useState<string>();

  const handleEdit = (id: string) => {
    setEditId(id);
    open("editCourseMetric");
  };

  const handleDelete = (id: string) => {
    deleteId.current = id;
    open("confirmation");
  };

  return (
    <>
      {editId && <EditCourseMetricValue courseId={id} metricId={editId} />}
      <ConfirmationDialog
        header="Delete course metric"
        text="Are you sure?"
        onConfirm={async () => {
          await deleteCourseMetricAsync({
            courseId: id,
            metricId: deleteId.current!,
          });
          deleteId.current = undefined;
        }}
      />
      <CreateCourseMetricValueModal courseId={id} />
      <PageHeader title={course?.name ?? ""} />
      <div className="flex flex-row items-start pb-6">
        <Button onClick={() => open("createCourseMetricValue")}>
          Create
          <PlusIcon />
        </Button>
      </div>
      <DataTable
        columns={columns(handleEdit, handleDelete)}
        data={courseMetrics ?? []}
      />
    </>
  );
};

export default CourseLimits;
