import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCourses } from "@/data/course/useCourses";
import { useResourceGroupPoolsFilters } from "@/data/rgPool/useResourceGroupPools";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, XIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useDebouncedCallback } from "use-debounce";

const RGPoolFilters: React.FC = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { name, courseId, setFilters } = useResourceGroupPoolsFilters();
  const handleChange = useDebouncedCallback((value: string) => {
    setFilters({ name: value, courseId });
    nav("/pools?page=0&size=10");
  }, 700);
  const { courses } = useCourses();
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-row items-center gap-2 mb-5">
      <div className="flex flex-row items-center gap-2 w-full">
        <Input
          className="w-1/2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleChange(e.target.value);
          }}
          placeholder={t("resourceGroupPools.filters.searchPlaceholder")}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              role="combobox"
              aria-expanded={open}
              className="w-1/2 justify-between"
            >
              {courseId
                ? courses?.items?.find((x) => x.id === courseId)?.name
                : t("resourceGroupPools.filters.selectCourse")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-1/2 p-0">
            <Command className="w-full">
              <CommandInput
                placeholder={t("resourceGroupPools.filters.searchCourse")}
              />
              <CommandList>
                <CommandEmpty className="w-full">
                  {t("resourceGroupPools.filters.noCourses")}
                </CommandEmpty>
                <CommandGroup>
                  {courses?.items?.map((course) => (
                    <CommandItem
                      key={course.id}
                      value={course.id}
                      onSelect={(currentValue) => {
                        setFilters({ name, courseId: currentValue });
                        setOpen(false);
                        nav("/pools?page=0&size=10");
                      }}
                    >
                      {course.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          courseId === course.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Button
        onClick={() => {
          setFilters({ name: "", courseId: "" });
          setSearch("");
          nav("/pools?page=0&size=10");
        }}
      >
        <XIcon />
        {t("resourceGroupPools.filters.clear")}
      </Button>
    </div>
  );
};

export default RGPoolFilters;
