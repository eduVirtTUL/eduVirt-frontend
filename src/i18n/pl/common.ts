import adam from "./adam";
import piotrek from "./piotrek";
import bartek from "./bartek";

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
};

const resourceGroupPools = {
  title: "Pule grup zasobów",
};

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
  menu,
  units,
  general,
  resourceGroupPools,
  ...adam,
  ...piotrek,
  ...bartek,
};
