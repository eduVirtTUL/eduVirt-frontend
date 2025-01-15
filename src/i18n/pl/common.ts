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
    nonVolatile: {
      name: "Pamięć trwała",
      units: {
        bytes: { name: "Bajty", symbol: "B" },
        kilobytes: { name: "Kilobajty", symbol: "KB" },
        megabytes: { name: "Megabajty", symbol: "MB" },
        gigabytes: { name: "Gigabajty", symbol: "GB" },
        terabytes: { name: "Terabajty", symbol: "TB" },
      },
    },
    volatile: {
      name: "Pamięć ulotna",
      units: {
        bytes: { name: "Bajty", symbol: "B" },
        kibibytes: { name: "Kibibajty", symbol: "KiB" },
        mebibytes: { name: "Mebibajty", symbol: "MiB" },
        gibibytes: { name: "Gibibajty", symbol: "GiB" },
        tebibytes: { name: "Tebibajty", symbol: "TiB" },
      },
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
  login: "Zaloguj się do eduVirt",
  notFound: "Strona nie znaleziona",
  teams: "Zespoły - eduVirt",
  team: "Zespół - eduVirt",
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
