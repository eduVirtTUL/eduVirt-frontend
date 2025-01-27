const vnicProfiles = {
    title: "Private segments",
    pool: {
        table: {
            vnicProfileName: "vNIC Profile Name",
            networkName: "Segment name",
            networkVlanId: "Segment VLAN number",
            inPool: {
                name: "In pool",
                selectOptions: {
                    all: "All",
                    inPool: "In pool",
                    notInPool: "Not in pool"
                }
            },
            searchPlaceholder: "Search by typing a value"
        },
        actions: {
            add: {
                name: "Add to pool",
                success: "The vNIC profile has been successfully added to the pool",
                error: "Failed to add the vNIC profile to the pool"
            },
            remove: {
                name: "Remove from Pool",
                success: "The vNIC profile has been successfully removed from the pool",
                error: "Failed to remove the vNIC profile from the pool"
            },
            details: {
                name: "Details",
                props: {
                    id: "ID",
                    name: "Profile",
                    inUse: "In use"
                }
            }
        }
    }
}

const vlansRange = {
    title: "VLAN Ranges",
    createButton: "Add new VLAN range",
    removeButton: "Remove",
    unitName: "Range",
    actions: {
        add: {
            success: "The VLAN range has been successfully added",
            error: "Failed to add the VLAN range"
        },
        remove: {
            success: "The VLAN range has been successfully removed",
            error: "Failed to remove the VLAN range"
        }
    }
}

const createVlansRangeModal = {
    title: "Define VLAN range",
    range: {
        start: "Range from",
        end: "Range to"
    },
    actionButton: "Create VLAN range",
    validation: {
        range: {
            belowLimit: "The value must be at least 0",
            aboveLimit: "The value can be at most 4096"
        }
    }
}

const ongoingReservations = {
    title: "Ongoing reservations"
}

export default {
    vnicProfiles,
    vlansRange,
    createVlansRangeModal,
    ongoingReservations
};