import { ErrorKey } from "./../../data/privateAxios";
import adam from "./adam";
import piotrek from "./piotrek";
import bartek from "./bartek";
import { Role } from "@/stores/userStore";

const menu = {
  courses: "Przedmioty",
  networks: "Sieci",
  metrics: "Metryki",
  reservations: "Rezerwacje",
  teams: "Zespoły",
  resourceGroups: "Grupy zasobów",
  resourceGroupPools: "Pule grup zasobów",
  home: "Strona główna",
  limits: "Ograniczenia",
  maintenance: "Zarządzanie",
  signOut: "Wyloguj",
  theme: {
    dark: "Ciemny",
    light: "Jasny",
    system: "Systemowy",
    title: "Motyw",
  },
  accessLevel: {
    title: "Poziom dostępu",
    administator: "Administrator",
    teacher: "Nauczyciel",
    student: "Student",
  },
};

const roles = {
  administrator: "Administrator",
  teacher: "Nauczyciel",
  student: "Student",
} satisfies { [key in Role]: string };

const general = {
  yes: "Tak",
  no: "Nie",
  page: "Strona",
  next: "Następna",
  previous: "Poprzednia",

  error: {
    "not.authorized":
      "Nie posiadasz wymaganych uprawnień aby wyświetlić tę stronę.",
    "operation.not.implemented": "Wybrana operacja nie jest jeszcze dostępna.",
    "connection.open.error":
      "Błąd podczas nawiązywania połączenia z silnikiem wirtualizacji oVirt.",
    "constraint.violation.exception":
      "Podane dane nie spełniają wymogów składniowych",
    "optimistic.lock.exception": "Wystąpił błąd. Spróbuj ponownie!",
    "internal.server.error":
      "W trakcie przetwarzania żądania wystąpił nieznany błąd. Spróbuj ponownie później.",
  },
};

const units = {
  memory: {
    name: "Pamięć",
    units: {
      mebibytes: {name: "Mebibajty", symbol: "MiB"},
      gibibytes: {name: "Gibibajty", symbol: "GiB"},
      tebibytes: {name: "Tebibajty", symbol: "TiB"},
    }
  },
  countable: {
    name: "Policzalne",
    units: {
      pieces: {
        name: "Sztuki",
        symbol: "szt."
      }
    }
  }
};

const errorKeys = {
  "course.not.found": "Nie znaleziono przedmiotu",
  noNetworkAvailable:
    "Liczba sieci została ograniczona przez przedmiot, brak dostepnych sieci",
  "courseLimits.error.value.already.defined":
    "Przedmiot posiada już tą metrykę",
  "courseLimits.error.value.not.defined": "Przedmiot nie posiada tej metryki",
  "resource.group.not.found": "Nie znaleziono grupy zasobów",
  "resource.group.pool.not.found": "Nie znaleziono puli grup zasobów",
  courseAlreadyExists: "Przedmiot o podanej nazwie już istnieje",
  courseConflict: "Nie pracujesz na najnowszych danych, proszę odśwież stronę",
  courseMetricNetworksNotSufficient:
    "W przedmiocie znajduje sie, która posiada więcej sieci niż wartość metryki.",
  rgAlreadyExists: "Grupa zasobów o podanej nazwie już istnieje",
  resourceGroupConflict:
    "Nie pracujesz na najnowszych danych, proszę odśwież stronę",
  resourceGroupPoolAlreadyExists:
    "Pula grup zasobów o podanej nazwie już istnieje",
  rgPoolConflict: "Nie pracujesz na najnowszych danych, proszę odśwież stronę",
  virtualMachineAlreadyExists:
    "Maszyna wirtualna o podanej nazwie już istnieje",
  virtualMachineClusterMismatch:
    "Maszyna wirtualna znajduje się w innym klastrze niż klaster przedmiotu",
  vmConflict: "Nie pracujesz na najnowszych danych, proszę odśwież stronę",

  "metrics.error.not.found": "Metric could not be found",
  "metrics.error.delete.exception": "Metric could not be removed",
  "metrics.error.name.already.taken": "Wybrana nazwa metryki jest już zajęta",
  "clusterMetricValues.error.value.not.defined": "Wartość metryki dla klastra nie została jeszcze zdefniowana",
  "clusterMetricValues.error.value.already.defined": "Wartość metryki dla klastra została już zdefniowana",
  "maintenanceIntervals.error.not.found": "Wybrana przerwa administracyjna nie została znaleziona",
  "maintenanceIntervals.error.too.long": "Wskazna długość przerwy administracyjnej przekracza dopuszczalne maksiumum",
  "maintenanceIntervals.error.invalid.time.window": "Początek przerwy administarcyjnej musi nastąpić przed jej końcem",
  "maintenanceIntervals.error.begin.at.past": "Przerwa administracyjna musi zaczynać się w przyszłości",
  "maintenanceIntervals.error.conflict": "Inne przerwy administracyjne już istnieją w wybranym oknie czasowym",
  "maintenanceIntervals.error.already.finished": "Wybrana przerwa administracyjna już się zakończyła",

  "reservations.error.not.found": "Wybrana rezerwacja nie została odnaleziona",
  "reservations.error.conflict": "W wybranym oknie czasowym wprowadzone są już inne rezerwacje",
  "reservations.error.end.before.start": "Koniec rezerwacji musi następić po jej rozpoczęciu",
  "reservations.error.start.in.past": "Rezerwacja nie może rozpoczynać się w przeszłości",
  "reservations.error.too.short": "Minimalna długość rezerwacji w systemie eduVirt wynosi dwukrotność minimalnego okna czasu",
  "reservations.error.creation.error": "Wystąpił błąd w trakcie tworzenia rezerwacji",
  "reservations.error.maintenance.interval.conflict": "W trakcie planowanej rezerwacji zdefiniowane są przerwy administracyjne",
  "reservations.error.course.resources.insufficient": "Zasoby kursu są niewystarczające do stworzenia nowej rezerwacji",
  "reservations.error.cluster.resources.insufficient": "Zasoby klastra są niewystarczające do stworzenia nowej rezerwacji",
  "reservations.error.max.length.exceeded": "Przekroczono maksymalną długość rezerwacji",
  "reservations.error.grace.period.not.finished": "Okres karencji od ostatniej rezerwacji musi upłynąć",
  "reservations.error.grace.period.could.not.finish": "Okres karencji planowanej rezerwacji przeciągnąłby się na kolejną rezerwację",
  "reservations.error.resource.group.already.reserved": "Podana grupa zasobów jest już zarezerwowana",
  "reservations.error.notification.time.too.long": "Czas wysłania powiadomienia o końcu rezerwacji nie może przekroczyć połowy długości rezerwacji",
  "reservations.error.reservation.count.exceeded": "Osiągnięto limit rezerwacji dla danego PODa",
  "reservations.error.stateful.pod.not.assigned": "Wybrany POD stanowy nie jest przypisany do twojego zespołu",
  "reservations.error.stateless.pod.not.assigned": "Wybrany POD bezstanowy nie jest przypisany do twojego zespołu",

  networkAlreadyExists: "Sieć o podanej nazwie już istnieje",
} satisfies { [key in ErrorKey]: string };

const notFoundPage = {
  title: "Strona nie znaleziona",
  description: "Strona, której szukasz, nie istnieje. Sprawdź adres URL.",
  back: "Powrót na stronę główną",
};

const pageTitles = {
  courses: "Przedmioty - eduVirt",
  course: "Przedmiot - eduVirt",
  resourceGroups: "Grupy zasobów - eduVirt",
  resourceGroup: "Grupa zasobów - eduVirt",
  resourceGroupPools: "Pule grup zasobów - eduVirt",
  resourceGroupPool: "Pula grup zasobów - eduVirt",
  courseMetrics: "Przedmiot - Metryki - eduVirt",
  teams: 'Zespoły - eduVirt',
  team: 'Zespół - eduVirt',
  metrics: 'Metryki - eduVirt',
  clusters: 'Klastry - eduVirt',
  reservations: 'Rezerwacje - eduVirt',
  reservationCalendar: 'Kalendarz rezerwacji - eduVirt',
  maintenanceCalendar: 'Kalendarz przerw administracyjnych - eduVirt',
  maintenanceInterval: 'Przerwa administracyjna - eduVirt',
  maintenanceIntervals: 'Przerwy administracyjne - eduVirt',
  clusterMetricValues: 'Klaster - Metryki - eduVirt',
  login: "Zaloguj się do eduVirt",
  notFound: "Strona nie znaleziona",
  courseTeams: "Zespoły przedmiotu {{courseName}} - eduVirt",
};

export default {
  save: "Zapisz",
  cancel: "Anuluj",
  next: "Dalej",
  previous: "Wstecz",
  create: "Utwórz",
  yes: "Tak",
  no: "Nie",
  add: "Dodaj",
  join: "Dołącz",
  close: "Zamknij",
  status: "Status",
  noResults: "Brak wyników",
  requiredFieldDescription: "(*) - pole wymagane",
  houres: "godz.",
  genericError: "Wystąpił błąd!",
  menu,
  units,
  general,
  errorKeys,
  roles,
  notFoundPage,
  pageTitles,
  ...adam,
  ...piotrek,
  ...bartek,
};
