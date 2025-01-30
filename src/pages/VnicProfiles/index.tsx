import PageHeader from "@/components/PageHeader";
import {useVnicProfiles} from "@/data/network/useVnicProfiles";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {useAddVnicProfileToPool} from "@/data/network/useAddVnicProfileToPool";
import {useRemoveVnicProfileFromPool} from "@/data/network/useRemoveVnicProfileFromPool";
import {Link} from "react-router";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CircleCheck,
    FilterIcon,
    FilterX,
    FoldHorizontal, Minus,
    MoreHorizontal, OctagonX,
} from "lucide-react";
import {ColumnDef, SortDirection} from "@tanstack/react-table";
import {VnicProfileDto} from "@/api";
import React, {useCallback, useState} from "react";
import {Popover, PopoverContent} from "@/components/ui/popover";
import {PopoverTrigger} from "@radix-ui/react-popover";
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
    const [ sortColumn, setSortColumn ] = useState<('vlanId' | 'networkName')>("vlanId");
    const [ sortDirection, setSortDirection ] = useState<SortDirection>("asc");

    const [ inPoolFlag, setInPoolFlag ] = useState<number>(0);

    const {vnicProfiles, isLoading} = useVnicProfiles({
        size: pageSize,
        page: pageNumber,
        sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ],
        inPool: inPoolFlag
    });

    const {vnicProfiles: nextVnicProfiles, isLoading: nextLoading} = useVnicProfiles({
        size: pageSize,
        page: pageNumber + 1,
        sort: sortColumn === null ? [] : [ `${sortColumn},${sortDirection}` ],
        inPool: inPoolFlag
    });

    const {addVnicProfileToPoolAsync} = useAddVnicProfileToPool();
    const {removeVnicProfileFromPoolAsync} = useRemoveVnicProfileFromPool();

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

    const handleSortingToggling = useCallback((columnName: 'vlanId' | 'networkName') => {
        if (columnName === sortColumn) {
            setSortDirection((prevDirection) => prevDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnName);
            setSortDirection("asc");
        }
    }, [sortColumn]);

    const handleInPoolFilter = () => {
        if (inPoolFlag === 0) {
            setInPoolFlag(1);
            setPageNumber(0);
        } else {
            setInPoolFlag(0);
            setPageNumber(0);
        }
    };

    const columns: ColumnDef<VnicProfileDto>[] = [
        {
            accessorKey: "name",
            header: () => {
                return (
                    <Button variant="ghost">
                        {t("vnicProfiles.pool.table.vnicProfileName")}
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
                    <Button variant="ghost" onClick={() => handleSortingToggling("networkName")}>
                        {t("vnicProfiles.pool.table.networkName")}
                        {chooseSortingArrow("networkName")}
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
                    <Button variant="ghost" onClick={() => handleSortingToggling("vlanId")}>
                        {t("vnicProfiles.pool.table.networkVlanId")}
                        {chooseSortingArrow("vlanId")}
                    </Button>
                );
            },
            cell: ({row}) => {
                return <div className="ml-20">{row.original.networkVlanId}</div>;
            },
        },
        {
            accessorKey: "inPool",
            header: () => {
                return (
                    <Button variant="ghost" onClick={() => handleInPoolFilter()}>
                        {t("vnicProfiles.pool.table.inPool.name")}
                        {inPoolFlag != 1 && inPoolFlag != 2 ? (
                            <FilterIcon className="ml-2 h-4 w-4"/>
                        ) : (
                            <FilterX className="ml-2 h-4 w-4"/>
                        )}
                    </Button>
                );
            },
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
        },
        {
            accessorKey: "inUse",
            header: () => {
                return (
                    <Button variant="ghost">
                        {t("vnicProfiles.pool.table.free")}
                    </Button>
                );
            },
            cell: ({row}) => {
                if (row.original.inUse === false) {
                    return <CircleCheck color={"#01b80a"} className="ml-7"/>
                }
                if (row.original.inUse === true) {
                    return <OctagonX color={"#ff1900"} className="ml-7"/>
                }
                return <Minus className="ml-7"/>
            }
        },
        {
            accessorKey: "valid",
            header: () => {
                return (
                    <Button variant="ghost">
                        {t("vnicProfiles.pool.table.valid.title")}
                    </Button>
                );
            },
            cell: ({row}) => {
                if (row.original.valid === true) {
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <CircleCheck color={"#01b80a"} className="ml-7"/>
                            </PopoverTrigger>
                            <PopoverContent side="right" className="w-80">
                                <p className="text-sm">
                                    {t("vnicProfiles.pool.table.valid.compliance")}
                                </p>
                            </PopoverContent>
                        </Popover>
                    );
                }
                if (row.original.valid === false) {
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <OctagonX color={"#ff1900"} className="ml-7"/>
                            </PopoverTrigger>
                            <PopoverContent side="right" className="w-50">
                                <p className="text-sm">
                                    <b>{t("vnicProfiles.pool.table.valid.errors")}:</b>
                                    {(row.original.validationErrors ?? []).map((key: string, index) => (
                                        <div key={index} style={{ color: 'red' }}>
                                            <br />
                                            {/* @ts-expect-error this doesn't impact the page */}
                                            {t("validations." + key)}
                                        </div>
                                    ))}
                                </p>
                            </PopoverContent>
                        </Popover>
                    );
                }

                return <Minus className="ml-7"/>
            }
        },
        {
            id: "actions",
            cell: ({row}) => {
                const vnicProfile = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 ml-10">
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
