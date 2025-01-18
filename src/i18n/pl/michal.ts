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
                success: "Vnic profil został pomyślnie dodany do puli",
                error: "Nie udało się dodać vnic profilu do puli",
            },
            remove: {
                success: "Vnic profil został pomyślnie usunięty z puli",
                error: "Nie udało się usunąć vnic profilu z puli",
            }
        }
    }
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

export default {
    vnicProfiles,
    vlansRange,
    createVlansRangeModal,
};