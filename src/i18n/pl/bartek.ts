
const courseType = {
    solo: "Solo",
    teamBased: "Zespołowy",
    soloDescription: "W przedmiocie typu 'Solo', studenci pracują indywidualnie (zespoły są maksymalnie jednoosobowe)",
    teamBasedDescription: "W przedmiocie zespołowym, studenci pracują w zespołach (zespoły są wieloosobowe)",
}

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
    success: "Dołączono do zespołu!",
};

const teamDetails = {
    title: "Zespół",
    leaveTeam: {
        button: "Opuść zespół",
        confirmHeader: "Opuść zespół",
        confirmText: "Czy na pewno chcesz opuścić ten zespół? Po opuszczeniu zespołu stracisz możliwość dokonywania rezerwacji podów przypisanych do tego zespołu.",
    },
    detailsCard: {
        title: "Szczegóły zespołu",
        courseName: "Przedmiot",
        courseDescription: "Opis przedmiotu",
        courseStatus: "Status zespołu",
        courseType: "Typ przedmiotu",
    },
    course: "Przedmiot:",
    status: "Status:",
    teamMembers: "Studenci w zespole",
    teamEmpty: "Zespół jest pusty",
    assignedPods: "Pody przypisane do zespołu",
    noPods: "Ten zespół nie posiada żadnych przypisanych podów",
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
}

const createCourseModalB = {
    teamBased: {
        title: "Typ przedmiotu",
        description: {
            solo: "Utworzony przedmiot będzie typu 'Solo'. Zespoły w kursie będą tworzone automatycznie w miarę dołączania studentów oraz będą maksymalnie jednoosobowe.",
            teamBased: "Utworzony przedmiot będzie typu 'Zespołowy'. Zespoły będą tworzone ręcznie oraz będą minimum dwuosobowe.",
        }
    }
}

const coursePageB = {
    courseTypeCard: {
        title: "Typ przedmiotu",
    },
    courseAccessKeyCard: {
        title: "Klucz dostępu",
        keyCopiedToast: "Klucz dostępu do kursu został skopiowany do schowka",
        button: "Utwórz klucz dostępu",
    },
    teamsTable: {
      button: "Zespoły",
      title: "Zespoły przedmiotu",
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
            maxSize: "Rozmiar",
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
            manageStatefulPods: "Pody stanowe",
            manageStatelessPods: "Pody bezstanowe",
            reservations: "Rezerwacje",
            deleteTeam: {
                button : "Usuń zespół",
                confirmation: {
                    title : "Usuń zespół",
                    description : "Czy na pewno chcesz usunąć ten zespół? Po usunięciu zespołu, wszyscy studenci w tym zespole stracą dostęp do przypisanych zasobów",    
            }},
            removeStudent: "Usuń studenta z przedmiotu",
        }
      },
    teachersCard: {
        title: "Nauczyciele",
        noTeachers: "Ten przedmiot nie posiada żadnych przypisanych nauczycieli",
        manageTeachers: "Zarządzaj",
    },
    courseTeamsPage: {
        searchByEmail:{
            button: "Wyszukaj studentów po numerze indeksu",
            clear: "Wyczyść wyszukiwanie",
        },
        removeStudentFromCourseSuccess: "Student został usunięty z przedmiotu",
        removeStudentFromTeamSuccess: "Student został usunięty z zespołu",
    }
}


const createCourseKeyModal = {
    title: "Utwórz klucz dostępu do kursu",
    keyLabel: "Klucz",
    description: {
        title: "Wymagania:",
        line1: "Klucz dostępu musi być unikalny wśród wszystkich przedmiotów",
        line2: "Klucz dostępu musi mieć długość od 4 do 20 znaków (wyłącznie litery i cyfry)",
    },
    validation: {
        keyMinLength: "Klucz nie może być krótszy niż 4 znaki",
        keyMaxLength: "Klucz nie może być dłuższy niż 20 znaków",
        keyRegex: "Klucz może zawierać tylko litery i cyfry",
    },
    success: "Klucz dostępu do przedmiotu został utworzony!",
}

const statefulPodManagementDrawer = {
    title: "Pody stanowe - ",
    resourceGroups: "Grupy zasobów",
    teamPods: "Pody stanowe zespołu",
    createPod: "Utwórz pod",
    noPods: "Zespół nie posiada żadnych przypisanych podów",
    noResourceGroups: "Nie znaleziono żadnych grup zasobów w tym przedmiocie",
    resourceGroup: "Grupa zasobów",
    maxRent: "Maksymalna liczba rezerwacji poda",
    alerts: {
        hasAssociatedPod: "Ta grupa zasobów posiada przypisany pod",
        noVMs: "Ta grupa zasobów nie posiada żadnych maszyn wirtualnych.",
    },
    delete: {
        button: "Usuń",
        confirmHeader: "Usuń pod",
        confirmText: "Czy na pewno chcesz usunąć ten pod? Zespół straci możliwość dokonywania rezerwacji zasobów przypisanych do tego poda.",
    },
    addMaxRentTimeModal: {
        title: "Dokończ tworzenie poda",
        description: "Ustaw maksymalną liczbę rezerwacji, które studenci mogą dokonać w ramach tego poda",
        maxRent: "Maksymalna liczba rezerwacji",
        success: "Maksymalna liczba rezerwacji została zaktualizowana pomyślnie",
    }
};

const statelessPodManagementDrawer = {
    title: "Pody bezstanowe - ",
    resourceGroupPools: "Pule grup zasobów",
    teamPods: "Pody bezstanowe zespołu",
    createPod: "Utwórz pod",
    noPods: "Zespół nie posiada żadnych przypisanych podów",
    resourceGroupPool: "Pula grup zasobów",
    alerts: {
        hasAssociatedPod: "Ta pula grup zasobów posiada przypisany pod",
    },
    delete: {
        button: "Usuń",
        confirmHeader: "Usuń pod",
        confirmText: "Czy na pewno chcesz usunąć ten pod? Zespół straci możliwość dokonywania rezerwacji zasobów przypisanych do tego poda.",
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
    name: "Nazwa Zespołu",
    nameDescription: "Wybierz unikalną nazwę dla zespołu",
    maxSize: "Maksymalny Rozmiar",
    maxSizeDescription: "Ustaw maksymalną liczbę członków zespołu",
    active: "Status Aktywności",
    activeDescription: "Gdy zespół jest dezaktywowany, studenci nie mogą dołącząć do zespołu oraz rezerwować przypisane do niego zasoby",
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
        title: "Usuń użytkownika",
        title2: "z zespołu",
        description: "Akcja ta spowoduje brak możliwości dokonywania rezerwacji zasobów przypisanych do tego zespołu. Czy na pewno chcesz usunąć tego użytkownika z zespołu?",
    },
    addUser: {
        email: "Adres e-mail",
        description: "Wprowadź adres e-mail studenta, którego chcesz dodać do zespołu",
    }
}

const manageCourseUsersModal = {
    title : "Studenci w przedmiocie",
    remove: "Usuń",
    add: "Dodaj",
    noUsers: "Ten przedmiot nie posiada żadnych studentów",
    delete: {
        title: "Usuń użytkownika",
        title2: "z zespołu",
        description: "Akcja ta spowoduje brak możliwości dokonywania rezerwacji zasobów przypisanych do tego studenta. Czy na pewno chcesz usunąć tego studenta z przedmiotu?",
    },
    addUser: {
        email: "Adres e-mail",
        description: "Wprowadź adres e-mail studenta, którego chcesz dodać do przedmiotu",
    }
}

const manageTeachersModal = {
    title: "Nauczyciele przedmiotu",
    current: "Obecni nauczyciele",
    add: "Dodaj nauczyciela",
    remove: "Usuń",
    noTeachers: "Ten przedmiot nie posiada żadnych nauczycieli",
    addTeacher: {
        email: "Adres e-mail",
        description: "Wprowadź adres e-mail nauczyciela, którego chcesz dodać do przedmiotu"
    },
    delete: {
        title: "Usuń nauczyciela {user} z przedmiotu {course}",
        description: "Czy na pewno chcesz usunąć tego nauczyciela z przedmiotu? Spowoduje to utratę dostępu do zarządzania przedmiotem dla tego użytkownika.",
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
    singleTab: "Pojedynczy zespół",
    bulkTab: "Wiele zespołów",
    name: "Nazwa zespołu",
    key: "Klucz do zespołu",
    maxSize: "Maksymalna liczba studentów w zespole",
    prefix: "Prefix nazwy zespołu",
    prefixDescription: "Zespoły zostaną utworzone z danym prefixem i kolejnym numerem",
    teamCount: "Liczba utworzonych zespołów",
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
        prefixMin: "Prefix jest wymagany",
        prefixMax: "Prefix nie może przekraczać 40 znaków",
        prefixRegex: "Prefix może zawierać tylko litery, cyfry",
    }
};

const searchByEmailModal = {
    title: "Wyszukaj studentów po numerach indeksów",
    search: "Wyszukaj",
    placeholder: "Enter student identifier...",
    description1: "Aby dodać numer indeksu studenta do wyszukiwania, wpisz wartość w pole tekstowe i naciśnij Enter lub Spację. Możesz usunąć numer indeksu klikając na przycisk X.",
    description2: "Aby wprowadzić wiele wartości jednocześnie, oddziel je przecinkiem lub spacją i wklej ze schowka.",
}


    const podManagement = {
      button: "Pody bezstanowe w kursie",
      title: "Zarządzanie podami bezstanowymi",
      resourcePools: "Pule zasobów",
      search: "Szukaj zespołów...",
      createPods: "Utwórz PODy",
      deletePods: "Usuń PODy",
      createSuccess: "Pomyślnie utworzono PODy",
      deleteSuccess: "Pomyślnie usunięto PODy",
      createError: "Błąd podczas tworzenia PODów",
      deleteError: "Błąd podczas usuwania PODów",
      columns: {
        name: "Nazwa zespołu",
        members: "Student",
        status: "Czy istnieje POD"
      },
      status: {
        hasPod: "Tak",
        noPod: "Nie"
      },
      noTeams: "Brak zespołów do wyświetlenia",
      loading: "Ładowanie...",
      noResourceGroups: "Brak dostępnych pul zasobów",
      searchPlaceholder: "Szukaj po imieniu, nazwisku lub emailu...",
        filterByPod: "Filtruj po statusie",
        filters: {
            all: "Wszystkie zespoły",
            withPod: "Zespoły z PODem",
            withoutPod: "Zespoły bez PODa"
        },
        selectPoolPrompt: "Wybierz pulę grup zasobów z listy po lewej stronie",
        confirmCreate: {
            description: "Czy na pewno chcesz utworzyć PODy bezstanowe dla zaznaczonych zespołów z wybraną pulą grup zasobów?",
            title: "Tworzenie PODów bezstanowych"
        },
        confirmDelete: {
            description: "Czy na pewno chcesz usunąć PODy bezstanowe dla zaznaczonych zespołów?",
            title: "Usuwanie PODów bezstanowych"
        }
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
    // deleteTeam: deleteTeamModal,
    manageTeachers: manageTeachersModal,
    searchByEmail: searchByEmailModal,
    podManagement,
};
