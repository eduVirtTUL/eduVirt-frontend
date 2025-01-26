import PageHeader from "@/components/PageHeader";
import {useVnicProfiles} from "@/data/network/useVnicProfiles";
import {useVnicProfilesDetails} from "@/data/network/useVnicProfilesDetails";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {useAddVnicProfileToPool} from "@/data/network/useAddVnicProfileToPool";
import {useRemoveVnicProfileFromPool} from "@/data/network/useRemoveVnicProfileFromPool";
import {Link} from "react-router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {ArrowDown, ArrowUp, ArrowUpDown, FoldHorizontal, MoreHorizontal,} from "lucide-react";
// import DataTable from "@/pages/VnicProfiles/DataTable";
import {ColumnDef, SortDirection} from "@tanstack/react-table";
import {VnicProfileDto, VnicProfilePoolMemberDto} from "@/api";
import React, {useCallback, useEffect, useState} from "react";
// import {Label} from "@/components/ui/label";
import {Popover, PopoverContent} from "@/components/ui/popover";
import {PopoverTrigger} from "@radix-ui/react-popover";
// import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
// import {Input} from "@/components/ui/input";
import {RouteHandle} from "@/AuthGuard";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import {Skeleton} from "@/components/ui/skeleton";
import SimpleDataTable from "@/components/SimpleDataTable";
import SimplePagination from "@/components/SimplePagination";

const VnicProfilesPage: React.FC = () => {
    const {t} = useTranslation();

    const [ pageNumber, setPageNumber ] = useState<number>(0);
    const [ pageSize ] = useState<number>(10);
    const [ sortColumn, setSortColumn ] = useState<string>("vlanid");
    const [ sortDirection, setSortDirection ] = useState<SortDirection>("asc");

    const {vnicProfiles, isLoading} = useVnicProfiles({
        size: pageSize,
        page: pageNumber,
        sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
    });

    const {vnicProfiles: nextVnicProfiles, isLoading: nextLoading} = useVnicProfiles({
        size: pageSize,
        page: pageNumber + 1,
        sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ]
    });

    const {addVnicProfileToPoolAsync} = useAddVnicProfileToPool();
    const {removeVnicProfileFromPoolAsync} = useRemoveVnicProfileFromPool();

    //todo
    // const [data, setData] = React.useState<VnicProfilePoolMemberDto[]>([]);
    // const {vnicProfilesDetails, isLoading: isLoadingDetails} = useVnicProfilesDetails();
    // useEffect(() => {
    //     setData(vnicProfilesDetails ?? []);
    // }, [vnicProfilesDetails]);

    // const [selectedFiltering, setSelectedFiltering] =
    //     React.useState<string>("allItems");

    const handleAddVnicProfile = async (vnicProfileId?: string) => {
        if (vnicProfileId) {
            await addVnicProfileToPoolAsync(vnicProfileId);
        }
    };

    const handleRemoveVnicProfileFromPool = async (vnicProfileId?: string) => {
        if (vnicProfileId) {
            await removeVnicProfileFromPoolAsync(vnicProfileId);
        }
    };

    const chooseSortingArrow = (columnName: string) => {
        if (columnName === sortColumn && sortDirection === "asc") {
            return <ArrowUp className="ml-2 h-4 w-4"/>;
        }
        if (columnName === sortColumn && sortDirection === "desc") {
            return <ArrowDown className="ml-2 h-4 w-4"/>;
        }
        return <ArrowUpDown className="ml-2 h-4 w-4"/>;
    };

    const handleSortingToggling = useCallback((columnName: string) => {
        if (columnName === sortColumn) {
            setSortDirection((prevDirection) => prevDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnName);
            setSortDirection("asc");
        }
    }, [sortColumn]);

    const handleDto = (dto: VnicProfilePoolMemberDto | undefined) => {
        //todo
        // if (!isLoadingDetails && dto) {
        //     return (
        //         <>
        //             <div className="w-90">
        //                 <b>{t("vnicProfiles.pool.actions.details.props.id")}: </b>
        //                 {dto?.id ?? null}
        //                 <br/>
        //                 <b>{t("vnicProfiles.pool.actions.details.props.name")}: </b>
        //                 {dto?.name ?? null}
        //                 <br/>
        //                 <b>{t("vnicProfiles.pool.actions.details.props.inUse")}: </b>
        //                 {dto.inUse ? t("yes") : t("no")}
        //                 <br/>
        //             </div>
        //         </>
        //     );
        // }
        return (
            <>
                ...
            </>
        );

    }

    const columns: ColumnDef<VnicProfileDto>[] = [
        {
            accessorKey: "name",
            header: () => {
                return (
                    <Button variant="ghost"
                            // onClick={() => handleSortingToggling(column)}
                    >
                        {t("vnicProfiles.pool.table.vnicProfileName")}
                        {/*{chooseSortingArrow(column.getIsSorted())}*/}
                    </Button>
                );
            },
            cell: ({row}) => {
                return <div className="ml-8">{row.original.name}</div>;
            },
        },
        {
            accessorKey: "networkName",
            header: () => {
                return (
                    <Button variant="ghost" onClick={() => handleSortingToggling("name")}>
                        {t("vnicProfiles.pool.table.networkName")}
                        {chooseSortingArrow("name")}
                    </Button>
                );
            },
            cell: ({row}) => {
                return <div className="ml-8">{row.original.networkName}</div>;
            },
        },
        {
            accessorKey: "networkVlanId",
            header: () => {
                return (
                    <Button variant="ghost" onClick={() => handleSortingToggling("vlanid")}>
                        {t("vnicProfiles.pool.table.networkVlanId")}
                        {chooseSortingArrow("vlanid")}
                    </Button>
                );
            },
            cell: ({row}) => {
                return <div className="ml-14">{row.original.networkVlanId}</div>;
            },
        },
        {
            accessorKey: "inPool",
            //todo sort on backend
            // header: ({column}) => {
            //     return (
            //         <Popover>
            //             <PopoverTrigger asChild>
            //                 <Button variant="ghost">
            //                     {t("vnicProfiles.pool.table.inPool.name")}
            //                     {column.getFilterValue() == null ? (
            //                         <FilterIcon className="ml-2 h-4 w-4"/>
            //                     ) : (
            //                         <FilterX className="ml-2 h-4 w-4"/>
            //                     )}
            //                 </Button>
            //             </PopoverTrigger>
            //             <PopoverContent>
            //                 <RadioGroup value={selectedFiltering}>
            //                     <div
            //                         className="flex items-center space-x-2"
            //                         onClick={() => {
            //                             setSelectedFiltering("allItems");
            //                             column.setFilterValue(null);
            //                         }}
            //                     >
            //                         <RadioGroupItem value="allItems" id="r1"/>
            //                         <Label htmlFor="r1">
            //                             {t("vnicProfiles.pool.table.inPool.selectOptions.all")}
            //                         </Label>
            //                     </div>
            //                     <div
            //                         className="flex items-center space-x-2"
            //                         onClick={() => {
            //                             setSelectedFiltering("inPoolItem");
            //                             column.setFilterValue(true);
            //                         }}
            //                     >
            //                         <RadioGroupItem value="inPoolItem" id="r2"/>
            //                         <Label htmlFor="r2">
            //                             {t("vnicProfiles.pool.table.inPool.selectOptions.inPool")}
            //                         </Label>
            //                     </div>
            //                     <div
            //                         className="flex items-center space-x-2"
            //                         onClick={() => {
            //                             setSelectedFiltering("notInPoolItem");
            //                             column.setFilterValue(false);
            //                         }}
            //                     >
            //                         <RadioGroupItem value="notInPoolItem" id="r3"/>
            //                         <Label htmlFor="r3">
            //                             {t("vnicProfiles.pool.table.inPool.selectOptions.notInPool")}
            //                         </Label>
            //                     </div>
            //                 </RadioGroup>
            //             </PopoverContent>
            //         </Popover>
            //     );
            // },
            cell: ({row}) => {
                const vnicProfile = row.original;

                return (
                    <Checkbox
                        disabled={true}
                        checked={vnicProfile.inPool}
                        className="ml-10"
                    />
                );
            },
            enableGlobalFilter: false,
        },
        {
            id: "actions",
            // header: ({table}) => {
            //     return (
            //         <Input
            //             className="w-full"
            //             placeholder={t("vnicProfiles.pool.table.searchPlaceholder")}
            //             onChange={(e) => table.setGlobalFilter(e.target.value)}
            //         />
            //     );
            // },
            cell: ({row}) => {
                const vnicProfile = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 ml-40">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Button
                                    className={"h-full w-full"}
                                    variant="ghost"
                                    disabled={vnicProfile.inPool}
                                    onClick={() => handleAddVnicProfile(vnicProfile.id)}
                                >
                                    {t("vnicProfiles.pool.actions.add.name")}
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Button
                                    className={"h-full w-full"}
                                    variant="ghost"
                                    disabled={!vnicProfile.inPool}
                                    onClick={() =>
                                        handleRemoveVnicProfileFromPool(vnicProfile.id)
                                    }
                                >
                                    {t("vnicProfiles.pool.actions.remove.name")}
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            className={"h-full w-full"}
                                            variant="ghost"
                                        >
                                            {t("vnicProfiles.pool.actions.details.name")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-100">
                                        {/*todo*/}
                                        {/*{handleDto(data.filter((dto) => dto.id === vnicProfile.id)[0])}*/}
                                        ...
                                    </PopoverContent>
                                </Popover>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isLoading || nextLoading) {
        return (
            <>
                <PageHeader title={t("vnicProfiles.title")}/>

                <div className="pb-5">
                    <Button asChild>
                        <Link to={"/networks/vlans"}>
                            <FoldHorizontal/>
                            {t("vlansRange.title")}
                        </Link>
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="rounded-md border">
                        <div className="border-b">
                            <div className="grid grid-cols-5 p-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-4 w-[100px]"/>
                                ))}
                            </div>
                        </div>
                        <div>
                            {Array.from({length: 10}, (_, i) => i + 1).map((row) => (
                                <div key={row} className="grid grid-cols-5 p-4 border-b">
                                    {[1, 2, 3, 4, 5].map((col) => (
                                        <Skeleton key={col} className="h-4 w-[100px]"/>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-3 mt-4">
                        <Skeleton className="h-8 w-[100px]"/>
                        <Skeleton className="h-8 w-[40px]"/>
                        <Skeleton className="h-8 w-[100px]"/>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader title={t("vnicProfiles.title")}/>

            <div className="pb-5">
                <Button asChild>
                    <Link to={"/networks/vlans"}>
                        <FoldHorizontal/>
                        {t("vlansRange.title")}
                    </Link>
                </Button>
            </div>

            {/*<DataTable*/}
            {/*    data={vnicProfiles ?? []}*/}
            {/*    columns={columns}*/}
            {/*    paginationEnabled={true}*/}
            {/*/>*/}
            <SimpleDataTable
                data={vnicProfiles ?? []}
                columns={columns}
            />

            <SimplePagination
                page={pageNumber}
                setPage={setPageNumber}
                hasMore={nextVnicProfiles !== undefined && nextVnicProfiles.length !== 0}
            />
        </>
    );
};

export default VnicProfilesPage;

export const handle: RouteHandle = {
    roles: ["administrator"],
};

export const meta = () => {
    return [{title: i18next.t("pageTitles.vnicProfiles")}];
};
