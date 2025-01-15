const courseLimits = {
  title: "Metryki",
  table: {
    openMenu: "Otwórz menu",
    columns: {
      name: "Nazwa",
      value: "Wartość",
    },
    edit: "Edytuj",
    delete: "Usuń",
  },
  deleteCourseMetric: {
    title: "Czy na pewno chcesz usunąć tę metrykę?",
    description: "Metryka zostanie usunięta, możesz ją dodać ponownie później.",
    success: "Metryka została usunięta pomyślnie",
    error: "Nie udało się usunąć metryki",
  },
  createCourseMetricValue: {
    title: "Utwórz wartość metryki",
    metric: "Metryka",
    select: "Wybierz metrykę",
    value: "Wartość",
    create: "Utwórz wartość metryki",
    success: "Wartość metryki została dodana pomyślnie",
    error: "Nie udało się dodać wartości metryki",
  },
  add: "Dodaj",
  editCourseMetricValue: {
    title: "Edytuj wartość metryki",
    value: "Wartość",
    save: "Zapisz",
    success: "Wartość metryki została zaktualizowana pomyślnie",
    error: "Nie udało się zaktualizować wartości metryki",
  },
  validation: {
    metricRequired: "Metryka jest wymagana",
    valueMustBeGraterOrEqualZero: "Wartość musi być większa lub równa zero",
  },
};

const createResourceGroupPoolModal = {
  title: "Utwórz pulę grup zasobów",
  name: "Nazwa*",
  maxRent: "Maksymalna liczba wypożyczeń*",
  maxRentDescription:
    "Określa ile razy grupa zasobów z puli może zostać wypożyczona przez jeden zespół.",
  maxRentDescription2: "Ustaw na 0, aby nie ograniczać ilości wypożyczeń.",
  gracePeriod: "Okres karencji*",
  gracePeriodDescription:
    "Określa ile godzin po zakończeniu wypożyczenia grupa zasobów z puli jest niedostępna dla innych zespołów.",
  gracePeriodDescription2:
    "Ustaw na 0, aby grupa zasobów była dostępna natychmiast po zakończeniu wypożyczenia.",
  course: "Przedmiot*",
  create: "Utwórz",
  success: "Pula grup zasobów została utworzona",
  error: "Nie udało się utworzyć puli grup zasobów",
  validation: {
    nameRequired: "Nazwa jest wymagana",
    nameMaxLength: "Nazwa nie może być dłuższa niż 50 znaków",
    maxRentGreaterOrEqualZero:
      "Maksymalna ilość wypożyczeń musi być większa lub równa zero",
    gracePeriodGreaterOrEqualZero:
      "Okres karencji musi być większy lub równy zero",
    courseRequired: "Przedmiot jest wymagany",
    descriptionRequired: "Opis jest wymagany",
    descriptionMaxLength: "Opis nie może być dłuższy niż 1000 znaków",
    maxRentTimeGreaterOrEqualZero:
      "Maksymalny czas wypożyczenia musi być większy lub równy zero",
  },
  selectCourse: "Wybierz przedmiot",
  noCourses: "Brak przedmiotów",
  searchCourses: "Szukaj przedmiotów",
  maxRentTime: "Maksymalny czas rezerwacji*",
  maxRentTimeDescription:
    "Określa maksymalny czas rezerwacji grupy zasobów z puli.",
  maxRentTimeDescription2:
    "Ustaw na 0:00 godz., aby nie ograniczać czasu rezerwacji.",
  description: "Opis",
};

const rentTimeSelector = {
  title: "Wybierz czas wypożyczenia",
};

const resourceGroupPoolPage = {
  title: "Pula grup zasobów",
  poolSettings: "Ustawienia puli",
  resourceGroups: "Grupy zasobów",
  createResourceGroup: "Utwórz grupę zasobów",
  delete: "Usuń",
  deleteConfirmation: "Czy na pewno chcesz usunąć tę pulę grup zasobów?",
  deleteConfirmationText:
    "Pula grup zasobów zostanie usunięta. Wraz z nią zostaną usunięte wszystkie grupy zasobów przypisane do tej puli. Tej operacji nie można cofnąć.",
  deleteSuccess: "Pula grup zasobów została usunięta",
  deleteError: "Nie udało się usunąć puli grup zasobów",
  fields: {
    name: "Nazwa",
    course: "Przedmiot",
    description: "Opis",
    maxRent: "Maksymalna liczba wypożyczeń",
    gracePeriod: "Okres karencji",
    maxRentTime: "Maksymalny czas rezerwacji",
  },
  type: "Pula grup zasobów",
  openEditor: "Otwórz edytor",
};

const createResourceGroupModal = {
  titleStateless: "Utwórz bezstanową grupę zasobów",
  titleStateful: "Utwórz stanową grupę zasobów",
  name: "Nazwa*",
  maxRentTime: "Maksymalny czas rezerwacji",
  description: "Opis",
  success: "Grupa zasobów została utworzona",
  error: "Nie udało się utworzyć grupy zasobów",
  descriptionInPoolWarning:
    "Tworzonej grupie zasobów zostanie przypisany opis z puli grup zasobów",
  maxRentTimeInPoolWarning:
    "Tworzonej grupie zasobów zostanie przypisany maksymalny czas rezerwacji z puli grup zasobów.",
  maxRentTimeDescription:
    "Określa maksymalny czas na jaki można zarezerwować grupę zasobów.",
  maxRentTimeDescription2:
    "Ustaw na 0:00 godz., aby nie ograniczać czasu rezerwacji.",
  validation: {
    nameRequired: "Nazwa jest wymagana",
    nameMaxLength: "Nazwa nie może być dłuższa niż 50 znaków",
    descriptionMaxLength: "Opis nie może być dłuższy niż 1000 znaków",
    maxRentTimeGreaterOrEqualZero:
      "Maksymalny czas rezerwacji musi być większy lub równy zero",
  },
};

const coursePage = {
  title: "Przedmiot",
  details: "Szczegóły",
  edit: "Edytuj",
  delete: "Usuń",
  reset: "Resetuj",
  limits: "Metryki",
  description: "Opis",
  externalLink: "Link zewnętrzny",
  deleteAction: {
    success: "Przedmiot został usunięty",
    error: "Nie udało się usunąć przedmiotu",
    confirmation: "Czy na pewno chcesz usunąć ten przedmiot?",
    confirmationText:
      "Przedmiot zostanie usunięty. Wszystkie grupy zasobów przypisane do tego przedmiotu zostaną usunięte. Tej operacji nie można cofnąć.",
  },
  updateAction: {
    success: "Przedmiot został zaktualizowany",
    error: "Nie udało się zaktualizować przedmiotu",
  },
  resetAction: {
    confirmation: "Czy na pewno chcesz zresetować ten przedmiot?",
    confirmationText:
      "Wysztkie zespoły, pody oraz rezerwacje zostaną usunięte. Grupy zasobów i pulę pozostaną bez zmian. Tej operacji nie można cofnąć.",
    success: "Przedmiot został zresetowany",
    error: "Nie udało się zresetować przedmiotu",
  },
};

const courseStatefulResourceGroups = {
  title: "Stanowe grupy zasobów",
  createResourceGroup: "Utwórz grupę zasobów",
  openEditor: "Otwórz edytor",
};

const coursePools = {
  title: "Pule grup zasobów",
  createPool: "Utwórz pulę",
  openPool: "Otwórz pulę",
};

const editResourceGroupPoolModal = {
  title: "Edytuj pulę grup zasobów",
  button: "Edytuj",
  success: "Pula grup zasobów została zaktualizowana",
  error: "Nie udało się zaktualizować puli grup zasobów",
};

const resourceGroupEditor = {
  type: "Grupa zasobów",
  addVirtualMachine: "Dodaj maszynę wirtualną",
  edit: "Edytuj",
  delete: "Usuń",
  privateSegments: {
    button: "Segmenty prywatne",
    title: "Zarządzaj segmentami prywatnymi",
    description:
      "Segmenty prywatne pozwalają na tworzenie sieci wewnętrznych w ramach grupy zasobów.",
    createSegment: "Utwórz segment",
    name: "Nazwa",
    placeholder: "Nazwa segmentu...",
    create: "Utwórz",
    segments: "Segmenty",
    interfaces: "NICs",
    actions: "Akcje",
    delete: "Usuń",
    deleteConfirmation: "Czy na pewno chcesz usunąć ten segment?",
    deleteConfirmationText:
      "Segment zostanie usunięty. Tej operacji nie można cofnąć. Wszystkie interfejsy sieciowe przypisane do tego segmentu zostaną odłączone.",
    deleteSuccess: "Segment został usunięty",
    deleteError: "Nie udało się usunąć segmentu",
  },
  virtualMachinesList: {
    title: "Maszyny wirtualne",
    hidden: "Ukryte",
    cpu: "vCPU",
    memory: "MiB",
    interfaces: "NICs",
    edit: "Edytuj",
    ovirt: "oVirt",
    noMachines: "Grupa nie zawiera maszyn wirtualnych",
  },
  interfaceList: {
    title: "Interfejsy",
    selectVirtualMachine: "Wybierz maszynę wirtualną",
    noInterfaces: "Brak interfejsów",
    public: "Publiczny",
    private: "Prywatny",
    mac: "MAC:",
    segment: "Segment:",
    detach: "Odłącz",
    profile: "Profil:",
    conflict: "Konflikt",
    conflictTooltip:
      "Do tego interfejsu jest przypisany zarówno profil sieciowy, jak i segment prywatny. Ten konflikt musi zostać ręcznie rozwiązany poprzez odłączenie interfejsu od jednego z nich.",
    detachConfirmationHeader: "Czy na pewno chcesz odłączyć ten interfejs?",
    detachConfirmationText:
      "Ta operacja odłączy interfejs od sieci. Maszyna wirtualna straci połączenie z tą siecią. Możesz ponownie podłączyć interfejs później. Czy chcesz kontynuować?",
    attach: "Przyłącz",
    attachTitle: "Przyłącz interfejs do segmentu prywatnego",
    selectPrivateSegment: "Wybierz segment prywatny",
  },
  deleteResourceGroup: {
    confirmation: "Czy na pewno chcesz usunąć tę grupę zasobów?",
    confirmationText:
      "Grupa zasobów zostanie usunięta. Wszystkie maszyny wirtualne przypisane do tej grupy zasobów zostaną usunięte. Tej operacji nie można cofnąć.",
    success: "Grupa zasobów została usunięta",
    error: "Nie udało się usunąć grupy zasobów",
  },
  updateResourceGroup: {
    success: "Grupa zasobów została zaktualizowana",
    error: "Nie udało się zaktualizować grupy zasobów",
  },
};

const addVmModal = {
  title: "Dodaj maszynę wirtualną do grupy zasobów",
  searchPlaceholder: "Wyszukaj maszynę wirtualną...",
  hidden: "Ukryte",
  hiddenDescription:
    "Ukryte maszyny wirtualne nie będą widoczne dla studentów.",
  noVirtualMachines: "Brak maszyn wirtualnych",
  noVirtualMachinesDescription:
    "Nie znaleziono maszyn wirtualnych spełniających kryteria wyszukiwania. Upewnij się, że maszyna, której szukasz znajduje się w odpowiednim klastrze.",
};

const removeVmModal = {
  confirmation: "Czy na pewno chcesz usunąć tę maszynę wirtualną?",
  confirmationText:
    "Maszyna wirtualna zostanie usunięta z grupy zasobów. Tej operacji nie można cofnąć.",
  success: "Maszyna wirtualna została usunięta",
  error: "Nie udało się usunąć maszyny wirtualnej",
};

const editVmModal = {
  title: "Edytuj maszynę wirtualną",
  hidden: "Ukryte",
  hiddenDescription:
    "Ukryte maszyny wirtualne nie będą widoczne dla studentów.",
  success: "Maszyna wirtualna została zaktualizowana",
  error: "Nie udało się zaktualizować maszyny wirtualnej",
};

const editResourceGroupModal = {
  title: "Edytuj grupę zasobów",
  name: "Nazwa*",
  description: "Opis",
  maxRentTime: "Maksymalny czas rezerwacji*",
  descriptionInPoolWarning:
    "Bezstanowa grupa zasobów posiada opis z puli grup zasobów",
  maxRentTimeInPoolWarning:
    "Bezstanowa grupa zasobów posiada maksymalny czas wypożyczenia z puli grup zasobów",
};

const editCourseModal = {
  title: "Edytuj przedmiot",
  name: "Nazwa*",
  externalLink: "Link zewnętrzny",
  description: "Opis",
  validation: {
    nameRequired: "Nazwa przedmiotu jest wymagana",
    descriptionRequired: "Opis przedmiotu jest wymagany",
    nameMaxLenght: "Nazwa przedmiotu nie może być dłuższa niż 50 znaków",
    descriptionMaxLenght:
      "Opis przedmiotu nie może być dłuższy niż 1000 znaków",
    externalLinkMaxLenght:
      "Link zewnętrzny nie może być dłuższy niż 1000 znaków",
    externalLinkShouldBeUrl:
      "Link zewnętrzny powinien być poprawnym adresem URL",
  },
};

const courseListPage = {
  title: "Przedmioty",
  searchPlaceholder: "Szukaj przedmiotu...",
  clear: "Wyczyść",
  createCourse: "Utwórz przedmiot",
  table: {
    name: "Nazwa",
    description: "Opis",
    details: "Szczegóły",
    edit: "Edytuj",
  },
};

const createCourseModal = {
  title: "Utwórz nowy przedmiot",
  name: "Nazwa*",
  description: "Opis",
  cluster: "Klaster*",
  selectCluster: "Wybierz klaster",
  externalLink: "Link zewnętrzny",
  teacherEmail: "Adres e-mail nauczyciela",
  validation: {
    nameRequired: "Nazwa przedmiotu jest wymagana",
    nameMaxLenght: "Nazwa przedmiotu nie może być dłuższa niż 50 znaków",
    descriptionMaxLenght:
      "Opis przedmiotu nie może być dłuższy niż 1000 znaków",
    clusterRequired: "Klaster jest wymagany",
    externalLinkMaxLenght:
      "Link zewnętrzny nie może być dłuższy niż 1000 znaków",
    externalLinkShouldBeUrl:
      "Link zewnętrzny powinien być poprawnym adresem URL",
    teacherEmail: "Podaj poprawny adres e-mail nauczyciela",
  },
  success: "Przedmiot został utworzony",
  error: "Nie udało się utworzyć przedmiotu",
};

export default {
  courseLimits,
  createResourceGroupPoolModal,
  rentTimeSelector,
  resourceGroupPoolPage,
  createResourceGroupModal,
  editResourceGroupPoolModal,
  courseStatefulResourceGroups,
  coursePools,
  coursePage,
  resourceGroupEditor,
  addVmModal,
  removeVmModal,
  editVmModal,
  editResourceGroupModal,
  editCourseModal,
  courseListPage,
  createCourseModal,
};
