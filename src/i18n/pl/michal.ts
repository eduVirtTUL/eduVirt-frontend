const vnicProfiles = {
    title: "Segmenty prywatne",
    pool: {
        table: {
            vnicProfileName: "Nazwa vnic profilu",
            networkName: "Nazwa segmentu",
            networkVlanId: "Numer VLAN segmentu",
            inPool: {
                name: "Czy w puli",
                selectOptions: {
                    all: "Wszystkie",
                    inPool: "W puli",
                    notInPool: "Nie w puli"
                }
            },
            searchPlaceholder: "Wyszukaj wpisując wartość"
        },
        actions: {
            add: {
                name: "Dodaj do puli",
                success: "Vnic profil został pomyślnie dodany do puli",
                error: "Nie udało się dodać vnic profilu do puli",
            },
            remove: {
                name: "Usuń z puli",
                success: "Vnic profil został pomyślnie usunięty z puli",
                error: "Nie udało się usunąć vnic profilu z puli",
            },
            details: {
                name: "Szczegóły",
                props: {
                    id: "ID",
                    name: "Profil",
                    inUse: "Czy w użyciu"
                }
            }
        }
    },
}

const vlansRange = {
    title: "Zakresy VLANów",
    createButton: "Dodaj nowy zakres VLANów",
    removeButton: "Usuń",
    unitName: "Zakres",
    actions: {
        add: {
            success: "Zakres VLANów został pomyślnie dodany",
            error: "Nie udało się dodać zakresu VLANów",
        },
        remove: {
            success: "Zakres VLANów został pomyślnie usunięty",
            error: "Nie udało się usunąć zakresu VLANów",
        }
    }
}

const createVlansRangeModal = {
    title: "Zdefiniuj zakres VLANów",
    range: {
        start: "Zakres od",
        end: "Zakres do"
    },
    actionButton: "Utwórz zakres VLANów",
    validation: {
        range: {
            belowLimit: "Wartość musi wynosić przynajmniej 0",
            aboveLimit: "Wartość może wynosić maksymalnie 4096",
        }
    }
}

const ongoingReservations = {
    title: "Trwające rezerwacje"
}

export default {
    vnicProfiles,
    vlansRange,
    createVlansRangeModal,
    ongoingReservations
};