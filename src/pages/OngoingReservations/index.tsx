import React, {useCallback, useState} from "react";
import {RouteHandle} from "@/AuthGuard";
import {t} from "i18next";
import {useCourseOngoingReservations} from "@/data/course/useCourseOngoingReservations";
import {ArrowDown, ArrowUp, ArrowUpDown} from "lucide-react";
import OngoingReservationTable from "./OngoingReservationTable";
import {Route} from "./+types";

const OngoingReservationsInCoursePage: React.FC<Route.ComponentProps> = ({params: {id}}) => {

    const [ pageNumber, setPageNumber ] = useState<number>(0);
    const [ pageSize ] = useState<number>(10);

    const [ sortColumn, setSortColumn ] = useState<string>("startTime");
    const [ sortDirection, setSortDirection ] = useState<"asc" | "desc">("asc");

    const { reservations, isLoading } = useCourseOngoingReservations({
        id: id!,
        page: pageNumber,
        size: pageSize,
        sort: [ `${sortColumn},${sortDirection}` ]
    });

    const { reservations: nextReservations, isLoading: nextLoading } = useCourseOngoingReservations({
        id: id!,
        page: pageNumber + 1,
        size: pageSize,
        sort: [ `${sortColumn},${sortDirection}` ]
    });

    const handleSort = useCallback((column: string) => {
        if (sortColumn === column) {
            setSortDirection((prevDirection) => prevDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    }, [sortColumn]);

    const chooseSortingArrow = (column: string) => {
        if (column === sortColumn && sortDirection === "desc")
            return <ArrowDown className="ml-2 h-4 w-4" />;
        if (column === sortColumn && sortDirection === "asc")
            return <ArrowUp className="ml-2 h-4 w-4" />;
        return <ArrowUpDown className="ml-2 h-4 w-4" />;
    };

    return (
        <>
            <OngoingReservationTable
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                handleSort={handleSort}
                chooseSortingArrow={chooseSortingArrow}
                reservations={reservations ?? []}
                isLoading={isLoading}
                nextReservations={nextReservations ?? []}
                nextLoading={nextLoading}
            />
        </>
    )
}

export default OngoingReservationsInCoursePage;

export const handle: RouteHandle = {
    roles: ["administrator", "teacher"],
};

export const meta = () => {
    return [{title: t("pageTitles.ongoingReservations")}];
};