const courseType = {
    solo: "Jednoosobowy",
    soloLowerCase: "jednoosobowy",
    teamBasedLowerCase: "zespołowy",
    teamBased: "Zespołowy",
    soloDescription: "W tym typie przedmiotu studenci pracują indywidualnie - każdy student stanowi osobny jednoosobowy zespół.",
    teamBasedDescription: "W tym typie przedmiotu studenci pracują grupowo - tworzone przez nauczyciela zespoły składają się z wielu osób.",
    cannotBeChanged: "Typ przedmiotu nie może zostać zmieniony po utworzeniu przedmiotu.",
};

const podType = {
    stateful: "Stanowy",
    stateless: "Bezstanowy"
}

const activeStatus = {
    active: "Aktywny",
    inactive: "Nieaktywny",
}

const teamsList = {
    title: "Twoje zespoły",
    table: {
        columns: {
            status: "Status",
            name: "Nazwa",
            course: "Przedmiot",
        },
        noTeams: "Nie jesteś obecnie członkiem żadnego zespołu",
    },
    viewDetails: "Wyświetl szczegóły",
    searchPlaceholder: "Szukaj zespołu...",
    clear: "Wyczyść",
    searchType: {
        placeholder: "Typ wyszukiwania",
        teamName: "Nazwa zespołu",
        studentName: "Student",
        studentEmail: "E-mail studenta",
    },
    searchResults: "Numery indeksów studentów"
};

const joinTeamModal = {
    button: "Dołącz do zespołu",
    title: "Dołącz do zespołu",
    keyLabel: "Klucz",
    keyDescription: "Wprowadź klucz otrzymany od nauczyciela",
    validation: {
        keyMinLength: "Klucz nie może być krótszy niż 4 znaki",
        keyMaxLength: "Klucz nie może być dłuższy niż 20 znaków",
        keyRegex: "Klucz może zawierać tylko litery i cyfry",
    },
    success: "Dołączono do zespołu",
};

const teamDetails = {
    title: "Zespół",
    leaveTeam: {
        button: "Opuść zespół",
        confirmHeader: "Opuść zespół",
        confirmText: "Czy na pewno chcesz opuścić ten zespół? Po opuszczeniu zespołu stracisz możliwość dokonywania rezerwacji PODów przypisanych do tego zespołu.",
        success: "Opuszczono zespół pomyślnie",
    },
    detailsCard: {
        title: "Szczegóły",
        courseName: "Przedmiot",
        courseDescription: "Opis przedmiotu",
        courseStatus: "Status zespołu",
        courseType: "Typ przedmiotu",
    },
    course: "Przedmiot:",
    status: "Status:",
    teamMembers: "Studenci",
    teamEmpty: "Zespół jest pusty",
    assignedPods: "Przypisane PODy",
    noPods: "Ten zespół nie posiada żadnych przypisanych PODów",
    error: {
        notInTeam: "Aby wyświetlić szczegóły zespołu, musisz być jego członkiem",
        teamNotFound: "Nie znaleziono zespołu",
        leaveTeamError: "Nie udało się opuścić zespołu",
    },
};

const podCard = {
    course: "Przedmiot",
    description: "Opis przedmiotu",
    makeAReservation: "Rezerwuj",
    maxRent: "Maksymalna liczba rezerwacji",
    availableRents: "Liczba dostępnych wypożyczeń",
    noRentLimit: "Brak limitu wypożyczeń"
}

const createCourseModalB = {
    teamBased: {
        title: "Typ przedmiotu",
        description: {
            solo: "W przedmiocie jednoosobowym zespoły są tworzone automatycznie podczas dołączania studentów. Każdy student pracuje indywidualnie w osobnym zespole.",
            teamBased: "W przedmiocie zespołowym zespoły są tworzone ręcznie przez nauczycieli. Studenci pracują wspólnie w zespołach wieloosobowych."
        }
    }
}

const coursePageB = {
    courseTypeCard: {
        title: "Typ przedmiotu",
    },
    courseAccessKeyCard: {
        title: "Klucz dostępu",
        keyCopiedToast: "Klucz dostępu do przedmiotu został skopiowany do schowka",
        button: "Utwórz klucz dostępu",
    },
    teamsTable: {
        button: "Zespoły",
        title: "Zespoły przedmiotu",
        back: "Powrót do przedmiotu",
        noTeams: "Brak zespołów",
        students: "Dodaj studenta",
        createTeam: "Utwórz zespół",
        edit: "Edytuj",
        columns: {
            name: "Nazwa",
            status: "Status",
            member: "Student",
            members: "Studenci",
            noMembers: "Zespół jest pusty",
            maxSize: "Maks. liczba studentów",
            operations: "Operacje",
            accessKey: {
                label: "Klucz dostępu",
                copy: "Kopiuj",
                copied: "Klucz dostępu do zespołu został skopiowany do schowka",
            }
        },
        dropdownMenu: {
            editTeam: "Edytuj",
            manageUsers: "Studenci",
            manageStatefulPods: "PODy stanowe",
            manageStatelessPods: "PODy bezstanowe",
            reservations: "Rezerwacje",
            deleteTeam: {
                button: "Usuń zespół",
                confirmation: {
                    title: "Usuń zespół",
                    description: "Czy na pewno chcesz usunąć ten zespół? Po usunięciu zespołu, wszyscy studenci w tym zespole stracą dostęp do przypisanych zasobów",
                }
            },
            removeStudent: "Usuń studenta z przedmiotu",
        }
    },
    teachersCard: {
        title: "Nauczyciele",
        noTeachers: "Ten przedmiot nie posiada żadnych przypisanych nauczycieli",
        manageTeachers: "Zarządzaj",
    },
    courseTeamsPage: {
        searchByEmail: {
            button: "Wyszukaj studentów po numerach indeksu",
            clear: "Wyczyść wyszukiwanie",
        },
        removeStudentFromCourseSuccess: "Student został usunięty z przedmiotu",
        removeStudentFromTeamSuccess: "Student został usunięty z zespołu",
    }
}

const createCourseKeyModal = {
    title: "Utwórz klucz dostępu do przedmiotu",
    keyLabel: "Klucz dostępu",
    description: {
        title: "Wymagania:",
        line2: "Klucz dostępu musi być unikalny wśród wszystkich przedmiotów",
        line3: "Klucz dostępu musi mieć długość od 4 do 20 znaków (wyłącznie litery, cyfry i znaki specjalne _ -)",
        line1: "Klucz dostępu jest niemodyfikowalny",
    },
    validation: {
        keyMinLength: "Klucz nie może być krótszy niż 4 znaki",
        keyMaxLength: "Klucz nie może być dłuższy niż 20 znaków",
        keyRegex: "Klucz może zawierać tylko litery i cyfry",
    },
    success: "Klucz dostępu do przedmiotu został utworzony pomyślnie",
}

const statefulPodManagementDrawer = {
    title: "PODy stanowe zespołu ",
    resourceGroups: "Grupy zasobów w przedmiocie",
    teamPods: "PODy stanowe zespołu",
    createPod: "Utwórz POD",
    success: "POD stanowy został utworzony pomyślnie",
    noPods: "Zespół nie posiada żadnych przypisanych PODów",
    noResourceGroups: "Ten przedmiot nie posiada żadnych stanowych grup zasobów",
    resourceGroup: "Grupa zasobów",
    maxRent: "Maksymalna liczba rezerwacji PODa",
    alerts: {
        hasAssociatedPod: "Ta grupa zasobów jest już przypisana do PODa",
        noVMs: "Ta grupa zasobów nie posiada żadnych maszyn wirtualnych.",
    },
    delete: {
        button: "Usuń",
        confirmHeader: "Usuń POD stanowy",
        confirmText: "Czy na pewno chcesz usunąć ten POD stanowy? Zespół straci możliwość dokonywania rezerwacji zasobów przypisanych do tego PODa.",
        success: "POD stanowy został usunięty pomyślnie",
    },
    addMaxRentTimeModal: {
        title: "Dokończ tworzenie PODa stanowego",
        description: "Ustaw maksymalną liczbę rezerwacji, które studenci mogą dokonać w ramach tworzonego PODa. Wartość ta nie może ulec zmianie.",
        maxRent: "Maksymalna liczba rezerwacji",
        success: "Maksymalna liczba rezerwacji została zaktualizowana pomyślnie",
    }
};

const statelessPodManagementDrawer = {
    title: "PODy bezstanowe zespołu ",
    resourceGroupPools: "Pule grup zasobów w przedmiocie",
    teamPods: "PODy bezstanowe zespołu",
    createPod: "Utwórz POD",
    success: "POD bezstanowy został utworzony pomyślnie",
    noPods: "Zespół nie posiada żadnych przypisanych PODów",
    noResourceGroupPools: "Ten przedmiot nie posiada żadnych pul grup zasobów",
    resourceGroupPool: "Pula grup zasobów",
    alerts: {
        hasAssociatedPod: "Ta pula grup zasobów jest już przypisana do PODa",
    },
    delete: {
        button: "Usuń",
        confirmHeader: "Usuń POD",
        confirmText: "Czy na pewno chcesz usunąć ten POD? Zespół straci możliwość dokonywania rezerwacji zasobów przypisanych do tego PODa.",
        success: "POD bezstanowy został usunięty pomyślnie",
    },
}

const soloTeamEditModal = {
    title: "Edycja zespołu",
    active: "Status aktywności",
    activeDescription: "Gdy zespół jest dezaktywowany, studenci nie mogą dołącząć do zespołu oraz rezerwować przypisane do niego zasoby",
    success: "Zespół został zaktualizowany pomyślnie",
};

const editTeamModal = {
    title: "Edycja zespołu",
    name: "Nazwa zespołu",
    nameDescription: "Nowa nazwa zespołu musi być unikalna w ramach przedmiotu",
    maxSize: "Maksymalna liczba studentów",
    maxSizeDescription: "Maksymalna liczba studentów w zespole nie może być mniejsza niż obecna liczba studentów",
    success: "Zespół został zaktualizowany pomyślnie",
    validation: {
        teamNameMin: "Nazwa zespołu jest wymagana",
        teamNameMax: "Nazwa zespołu nie może przekraczać 50 znaków",
        teamNameRegex: "Nazwa zespołu może zawierać tylko litery, cyfry, spacje i znaki specjalne: - _",
        maxSizeMin: "Maksymalna liczba studentów w zespole musi być większa lub równa 2",
        maxSizeMax: "Maksymalna liczba studentów w zespole nie może przekraczać 10",
    }
};

const manageTeamUsersModal = {
    title: "Studenci w zespole ",
    remove: "Usuń",
    add: "Dodaj",
    noUsers: "Ten zespół jest pusty",
    delete: {
        title: "Usuń studenta",
        title2: "z zespołu",
        description: "Akcja ta spowoduje brak możliwości dokonywania rezerwacji zasobów przypisanych do tego zespołu. Czy na pewno chcesz usunąć tego studenta z zespołu?",
        success: "Student został usunięty z zespołu pomyślnie",
    },
    addUser: {
        email: "Adres e-mail",
        description: "Adres e-mail studenta, którego ma zostać dodany do zespołu",
        success: "Student został dodany do zespołu pomyślnie",
        validation:{
            email: "Nieprawidłowy format adresu e-mail"
        }
    }
}

const manageCourseUsersModal = {
    title: "Dodaj studenta do przedmiotu",
    remove: "Usuń",
    add: "Dodaj",
    noUsers: "Ten przedmiot nie posiada żadnych studentów",
    delete: {
        title: "Usuń studenta",
        title2: "z przedmiotu",
        description: "Akcja ta spowoduje brak możliwości dokonywania rezerwacji zasobów przypisanych do tego studenta. Czy na pewno chcesz usunąć tego studenta z przedmiotu?",
        success: "Student został usunięty z przedmiotu pomyślnie",
    },
    addUser: {
        email: "Adres e-mail",
        description: "Adres e-mail studenta, którego ma zostać dodany do przedmiotu",
        success: "Student został dodany do przedmiotu pomyślnie",
        validation:{
            email: "Nieprawidłowy format adresu e-mail"
        }
    }
}

const manageTeachersModal = {
    title: "Nauczyciele w przedmiocie",
    current: "Usuń",
    add: "Dodaj",
    remove: "Usuń",
    noTeachers: "Ten przedmiot nie posiada żadnych nauczycieli",
    addTeacher: {
        email: "Adres e-mail",
        description: "Wprowadź adres e-mail nauczyciela, którego chcesz dodać do przedmiotu",
        success: "Nauczyciel został dodany do przedmiotu",
        validation:{
            email: "Nieprawidłowy format adresu e-mail"
        }
    },
    delete: {
        title: "Usuń nauczyciela z przedmiotu",
        description: "Akcja ta spowoduje to utratę dostępu do zarządzania przedmiotem dla tego nauczyciela. Czy na pewno chcesz usunąć tego nauczyciela z przedmiotu?",
        success: "Nauczyciel został usunięty z przedmiotu",
    },
    success: {
        add: "Nauczyciel został dodany do przedmiotu",
        remove: "Nauczyciel został usunięty z przedmiotu"
    },
    error: {
        add: "Nie udało się dodać nauczyciela do przedmiotu",
        remove: "Nie udało się usunąć nauczyciela z przedmiotu"
    }
}

const createTeamModal = {
    title: "Tworzenie zespołu",
    singleTab: "Ręczne",
    bulkTab: "Automatyczne",
    name: "Nazwa",
    key: "Klucz dostępu",
    keyDescription: "Pusta wartość tego pola spowoduje wygenerowanie losowego, unikalnego klucza dostępu do zespołu",
    maxSize: "Maksymalna liczba studentów w zespole",
    prefix: "Prefiks nazwy zespołu",
    prefixDescription: "Nazwy zespołów zostaną utworzone z podanym prefiksem i kolejnym numerem, np. 'PodanyPrefiks-1'",
    teamCount: "Liczba utworzonych zespołów",
    keyCreatedAutomatically: "Unikalny klucz dostępu do każdego z utworzonych automatycznie zespołów zostanie wygenerowany automatycznie",
    validation: {
        teamNameMin: "Nazwa zespołu jest wymagana",
        teamNameMax: "Nazwa zespołu nie może przekraczać 50 znaków",
        teamNameRegex: "Nazwa zespołu może zawierać tylko litery, cyfry, spacje i znaki specjalne: - _",
        keyMinLength: "Klucz nie może być krótszy niż 4 znaki",
        keyMaxLength: "Klucz nie może być dłuższy niż 20 znaków",
        keyRegex: "Klucz może zawierać tylko litery i cyfry",
        maxSizeMin: "Maksymalna liczba studentów w zespole musi być większa lub równa 2",
        maxSizeMax: "Maksymalna liczba studentów w zespole nie może przekraczać 10",
        teamCountMin: "Liczba zespołów musi być większa od 1",
        teamCountMax: "Liczba zespołów nie może przekraczać 10",
        prefixMin: "Prefiks jest wymagany",
        prefixMax: "Prefiks nie może przekraczać 40 znaków",
        prefixRegex: "Prefiks może zawierać tylko litery, cyfry",
    },
    success: "Zespół został utworzony pomyślnie",
    batchSuccess: "Zespoły zostały utworzone pomyślnie",
    deleteSuccess: "Zespół został usunięty pomyślnie",
};

const searchByEmailModal = {
    title: "Wyszukaj studentów po numerach indeksów",
    search: "Wyszukaj",
    placeholder: "Enter student identifier...",
    description1: "Aby dodać numer indeksu studenta do wyszukiwania, wpisz wartość w pole tekstowe i naciśnij Enter lub Spację. Numer indeksu można usunąć klikając na symbol X.",
    description2: "Aby wprowadzić numery indeksów wielu studentów jednocześnie, należy oddzielić je przecinkiem lub spacją i wkleić ze schowka.",
}

const podManagement = {
    button: "PODy bezstanowe",
    title: "Zarządzanie PODami bezstanowymi",
    resourcePools: "Pule zasobów",
    search: "Szukaj zespołów...",
    createPods: "Utwórz PODy",
    deletePods: "Usuń PODy",
    columns: {
        name: "Nazwa zespołu",
        members: "Student",
        status: "Czy posiada POD"
    },
    status: {
        hasPod: "Tak",
        noPod: "Nie"
    },
    noTeams: "Brak zespołów do wyświetlenia",
    loading: "Ładowanie...",
    noResourceGroupPools: "Ten przedmiot nie posiada żadnych pul grup zasobów",
    searchPlaceholder: "Szukaj po imieniu, nazwisku lub e-mailu...",
    filterByPod: "Filtruj po statusie",
    filters: {
        all: "Wszystkie zespoły",
        withPod: "Zespoły z PODem",
        withoutPod: "Zespoły bez PODa"
    },
    selectPoolPrompt: "Wybierz pulę grup zasobów z listy po lewej",
    confirmCreate: {
        description: "Czy na pewno chcesz utworzyć PODy bezstanowe dla zaznaczonych zespołów z wybraną pulą grup zasobów?",
        title: "Tworzenie PODów bezstanowych"
    },
    confirmDelete: {
        description: "Czy na pewno chcesz usunąć PODy bezstanowe dla zaznaczonych zespołów?",
        title: "Usuwanie PODów bezstanowych"
    },
    createSuccess: "PODy bezstanowe zostały utworzone pomyślnie",
    deleteSuccess: "PODy bezstanowe zostały usunięte pomyślnie",
}


export default {
    podType,
    activeStatus,
    courseType,
    teamDetails,
    podCard,
    teamsList,
    coursePageB,
    createCourseB: createCourseModalB,
    statefulPodManagement: statefulPodManagementDrawer,
    statelessPodManagement: statelessPodManagementDrawer,
    soloTeamEdit: soloTeamEditModal,
    joinTeam: joinTeamModal,
    editTeam: editTeamModal,
    createTeam: createTeamModal,
    createCourseKey: createCourseKeyModal,
    manageTeamUsers: manageTeamUsersModal,
    manageCourseUsers: manageCourseUsersModal,
    manageTeachers: manageTeachersModal,
    searchByEmail: searchByEmailModal,
    podManagement,
};
