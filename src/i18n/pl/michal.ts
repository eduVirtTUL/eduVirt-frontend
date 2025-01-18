const vnicProfiles = {
    pool: {
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

const vlansRange = {
    add: {
        success: "Zakres VLANów został pomyślnie dodany",
        error: "Nie udało się dodać zakresu VLANów",
    },
    remove: {
        success: "Zakres VLANów został pomyślnie usunięty",
        error: "Nie udało się usunąć zakresu VLANów",
    }
}

export default {
    vnicProfiles,
    vlansRange,
};