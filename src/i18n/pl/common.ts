import { ErrorKey } from "@/data/privateAxios";
import adam from "./adam";
import piotrek from "./piotrek";
import bartek from "./bartek";
import { Language, Role } from "@/stores/userStore";
import michal from "@/i18n/pl/michal";

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
  languages: {
    title: "Język",
    pl: "Polski",
    en: "Angielski",
  },
  accessLevel: {
    title: "Poziom dostępu",
    administator: "Administrator",
    teacher: "Nauczyciel",
    student: "Student",
  },
};

const languages = {
  pl: "Polski",
  en: "Angielski",
} satisfies { [key in Language]: string };

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
      mebibytes: { name: "Mebibajty", symbol: "MiB" },
      gibibytes: { name: "Gibibajty", symbol: "GiB" },
      tebibytes: { name: "Tebibajty", symbol: "TiB" },
    },
  },
  countable: {
    name: "Policzalne",
    units: {
      pieces: {
        name: "Sztuki",
        symbol: "szt.",
      },
    },
  },
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

  "clusters.error.not.found": "Wybrany klaster nie został odnaleziony",
  "metrics.error.not.found": "Metryka nie została znaleziona",
  "metrics.error.delete.exception": "Metryka nie mogła zostać usunięta",
  "metrics.error.name.already.taken": "Wybrana nazwa metryki jest już zajęta",
  "clusterMetricValues.error.value.not.defined": "Wartość metryki dla klastra nie została jeszcze zdefniowana",
  "clusterMetricValues.error.value.already.defined": "Wartość metryki dla klastra została już zdefniowana",
  "clusterMetricValues.error.conflict.exception": "Nie pracujesz na najnowszych danych, spróbuj ponownie po odświeżeniu strony.",
  "maintenanceIntervals.error.not.found": "Wybrana przerwa administracyjna nie została znaleziona",
  "maintenanceIntervals.error.invalid.time.window": "Początek przerwy administarcyjnej musi nastąpić przed jej końcem",
  "maintenanceIntervals.error.begin.too.early": "Przerwa administracyjna musi zostać zdefiniowana z conajmniej sześciogodzinnym wyprzedzeniem",
  "maintenanceIntervals.error.conflict": "Inne przerwy administracyjne już istnieją w wybranym oknie czasowym",
  "maintenanceIntervals.error.already.finished": "Wybrana przerwa administracyjna już się zakończyła",

  "reservations.error.not.found": "Wybrana rezerwacja nie została odnaleziona",
  "reservations.error.conflict":
    "W wybranym oknie czasowym wprowadzone są już inne rezerwacje",
  "reservations.error.end.before.start":
    "Koniec rezerwacji musi następić po jej rozpoczęciu",
  "reservations.error.start.in.past":
    "Rezerwacja nie może rozpoczynać się w przeszłości",
  "reservations.error.too.short":
    "Minimalna długość rezerwacji w systemie eduVirt wynosi dwukrotność minimalnego okna czasu",
  "reservations.error.creation.error":
    "Wystąpił błąd w trakcie tworzenia rezerwacji",
  "reservations.error.maintenance.interval.conflict":
    "W trakcie planowanej rezerwacji zdefiniowane są przerwy administracyjne",
  "reservations.error.course.resources.insufficient":
    "Zasoby kursu są niewystarczające do stworzenia nowej rezerwacji",
  "reservations.error.cluster.resources.insufficient":
    "Zasoby klastra są niewystarczające do stworzenia nowej rezerwacji",
  "reservations.error.max.length.exceeded":
    "Przekroczono maksymalną długość rezerwacji",
  "reservations.error.grace.period.not.finished":
    "Okres karencji od ostatniej rezerwacji musi upłynąć",
  "reservations.error.grace.period.could.not.finish":
    "Okres karencji planowanej rezerwacji przeciągnąłby się na kolejną rezerwację",
  "reservations.error.resource.group.already.reserved":
    "Podana grupa zasobów jest już zarezerwowana",
  "reservations.error.notification.time.too.long":
    "Czas wysłania powiadomienia o końcu rezerwacji nie może przekroczyć połowy długości rezerwacji",
  "reservations.error.reservation.count.exceeded":
    "Osiągnięto limit rezerwacji dla danego PODa",
  "reservations.error.stateful.pod.not.assigned":
    "Wybrany POD stanowy nie jest przypisany do twojego zespołu",
  "reservations.error.stateless.pod.not.assigned":
    "Wybrany POD bezstanowy nie jest przypisany do twojego zespołu",

  "ovirt.vnic.profile.not.found":
    "Wybrany vnic profile nie jest dostępny w oVirt, proszę odśwież stronę",
  "eduvirt.vnic.profile.not.found":
    "Wybrany vnic profile nie jest dostępny w eduVirt, proszę odśwież stronę",
  "vnic.profile.already.exists":
    "Wybrany vnic profile aktualnie znajduje się już w puli, proszę odśwież stronę",
  "vlans.range.not.found": "Wybrany zakres VLANów nie został odnaleziony",
  "vlans.range.invalid.definition":
    "Zakres VLANów został niepoprawnie zdefiniowany",
  "vlans.range.conflicting.range":
    "Ramy nowotworzonego zakresu VLANów pokrywają się z już istniejącym zakresem",
  "general.error.connection.open.error":
    "Wystąpił problem z połączeniem do oVirta",

  networkAlreadyExists: "Sieć o podanej nazwie już istnieje",

  "course.invalid.type": "Nieprawidłowy typ przedmiotu",
  "teacher.already.in.course": "Nauczyciel już jest przypisany do przedmiotu",
  "teacher.not.in.course": "Nauczyciel nie jest przypisany do przedmiotu",
  "course.no.teachers": "Przedmiot nie posiada przypisanych nauczycieli",
  "user.not.found": "Nie znaleziono użytkownika",
  "user.not.authorized": "Ten użytkownik nie może być częścią wykonywanej operacji.",
  "user.name.already.exists": "Nazwa użytkownika jest już zajęta",
  "team.not.found": "Nie znaleziono zespołu",
  "team.not.found.in.course": "Nie znaleziono zespołu w przedmiocie",
  "team.already.exists": "Zespół o podanej nazwie już istnieje",
  "team.not.active": "Zespół nie jest aktywny",
  "team.user.not.member": "Użytkownik nie jest członkiem zespołu",
  "team.user.already.member": "Użytkownik jest już członkiem zespołu",
  "team.validation.exception": "Błąd w trakcie walidacji zespołu",
  "incorrect.team.type.exception": "Nieprawidłowy typ zespołu",
  "user.already.in.course.exception": "Student znajduje się już w tym przedmiocie",
  "team.conflict.exception": "Nie pracujesz na najnowszych danych, proszę odświeżyć stronę",
  "pod.not.found": "Nie znaleziono PODa",
  "pod.already.exists": "POD o podanej nazwie już istnieje",
  "pod.invalid.type": "Nieprawidłowy typ PODa",
  "access.key.not.found.exception": "Nie znaleziono klucza dostępu",
  "access.key.already.exists": "Klucz dostępu do tego przedmiotu już istnieje",
  "access.key.invalid.format": "Format klucza dostępu jest nieprawidłowy",
  "access.key.invalid.type": "Typ klucza dostępu jest nieprawidłowy",
  "access.key.duplicate": "W systemie istnieje już taki klucz dostępu. Spróbuj ponownie",
  "access.key.could.not.be.generated": "Nie można było wygenerować klucza dostępu",
  "teacher.self.modification.exception": "Nauczyciel nie może usunąć samego siebie z przedmiotu",
  "pod.deletion.exception": "POD posiada aktywne rezerwacje i nie może zostać usunięty",
  "team.deletion.exception": "Zespół posiada przypisane PODy - aby usunąć zespół, usuń najpierw przypisane mu PODy",
  "ovirt.vnic.profile.currently.in.use":
  "Vnic profile znajduje się aktualnie w użyciu, co uniemożliwia wykonywania na nim operacji",
  "team.size.exception": "Zespół nie może przekroczyć maksymalnej liczby członków", 
} satisfies { [key in ErrorKey]: string };

const notFoundPage = {
  title: "Strona nie znaleziona",
  description: "Strona, której szukasz, nie istnieje. Sprawdź adres URL.",
  back: "Powrót na stronę główną",
};

const loginNotFoundPage = {
  title: "Użytkownik nie został znaleziony w bazie systemu oVirt",
  description:
    "eduVirt wymaga zarejestrowania się w systemie oVirt. Skorzystaj z linku poniżej, aby przejść do strony logowania. Po zalogowaniu się w systemie oVirt, wróć do eduVirt i spróbuj ponownie.",
  oVirtLogin: "Zaloguj się w systemie oVirt",
  goBackToLogin: "Wróć do strony logowania",
};

const pageTitles = {
  courses: "Przedmioty - eduVirt",
  course: "Przedmiot - eduVirt",
  resourceGroups: "Grupy zasobów - eduVirt",
  resourceGroup: "Grupa zasobów - eduVirt",
  resourceGroupPools: "Pule grup zasobów - eduVirt",
  resourceGroupPool: "Pula grup zasobów - eduVirt",
  courseMetrics: "Przedmiot - Metryki - eduVirt",
  teams: "Zespoły - eduVirt",
  team: "Zespół - eduVirt",
  metrics: "Metryki - eduVirt",
  clusters: "Klastry - eduVirt",
  reservations: "Rezerwacje - eduVirt",
  reservationCalendar: "Kalendarz rezerwacji - eduVirt",
  maintenanceCalendar: "Kalendarz przerw administracyjnych - eduVirt",
  maintenanceInterval: "Przerwa administracyjna - eduVirt",
  maintenanceIntervals: "Przerwy administracyjne - eduVirt",
  clusterMetricValues: "Klaster - Metryki - eduVirt",
  login: "Zaloguj się do eduVirt",
  notFound: "Strona nie znaleziona",
  courseTeams: "Zespoły przedmiotu - eduVirt",
  vlansRanges: "Zakresy VLANów - eduVirt",
  vnicProfiles: "Segmenty prywatne - eduVirt",
  ongoingReservations: "Trwające rezerwacje - eduVirt",
  reservationStatistics: "Statystyki rezerwacji - eduVirt",
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
  noResults: "Brak danych",
  requiredFieldDescription: "(*) - pole wymagane",
  houres: "godz.",
  genericError: "Wystąpił błąd!",
  loginUsingSSO: "Zaloguj się z wykorzystaniem SSO systemu oVirt",
  menu,
  units,
  general,
  errorKeys,
  languages,
  roles,
  notFoundPage,
  pageTitles,
  loginNotFoundPage,
  ...adam,
  ...piotrek,
  ...bartek,
  ...michal,
};
