const clusters = {
  title: 'Klastry',
  table: {
    openMenu: 'Otwórz menu',
    columns: {
      name: 'Nazwa',
      description: 'Opis',
      comment: 'Komentarz',
      hosts: 'Liczba hostów',
      vms: 'Liczba maszyn wirtualnych',
    },
    viewLimits: 'Wyświetl ograniczenia klastra',
    showIntervals: 'Wyświetl przerwy administracyjne',
  },
  details: {
    title: 'Klaster',
    table: {
      columns: {
        identifier: 'Identyfikator',
        description: 'Opis',
        comment: 'Komentarz',
        cpuType: 'Typ CPU',
        compatibilityVersion: 'Wersja zgodności',
        threadsAsCores: 'Wykorzystaj wątki jako rdzenie',
        maxMemoryOverCommit: 'Maksymalny over-commit pamięci',
      }
    },
    ovirt: {
      cluster: 'Zobacz klaster w ramach systemu oVirt',
      network: 'Zobacz sieci w ramach systemu oVirt',
      host: 'Zobacz węzły klastra w ramach systemu oVirt',
      event: 'Zobacz dziennik zdarzeń klastra w ramach systemu oVirt',
    },
    tabs: {
      details: 'Szczegóły',
      hosts: 'Hosty',
      network: 'Sieci',
      metric: 'Metryki',
      event: 'Dziennik zdarzeń',
    }
  },
  error: {
    "not.found": 'Wybrany klaster nie został znaleziony',
  },
}

const hosts = {
  table: {
    columns: {
      name: 'Nazwa',
      domainName: 'Nazwa domenowa',
      cpuCount: 'Liczba CPU',
      memorySize: 'Rozmiar RAM'
    }
  }
}

const networks = {
  table: {
    columns: {
      name: 'Nazwa',
      description: 'Opis',
      comment: 'Komentarz',
      status: 'Stan'
    }
  }
}

const events = {
  table: {
    columns: {
      message: 'Treść',
      severity: 'Poziom istotności',
      registeredAt: 'Czas wystąpienia'
    }
  }
}

const metrics = {
  title: 'Metryki',
  table: {
    openMenu: 'Otwórz menu',
    columns: {
      name: 'Nazwa',
      category: 'Kategoria'
    },
    delete: 'Usuń',
  },
  add: 'Dodaj',
  createMetric: {
    title: 'Utwórz metrykę',
    name: 'Nazwa',
    nameDescription: 'Nazwa metryki musi być unikalna w skali wszystkich zdefniowanych metryk.',
    category: 'Kategoria',
    categoryDescription: 'Kategoria metryki określa zakres możliwych do wyboru dla danej metryki jednostek miary.',
    select: 'Wybierz kategorię metryki',
    submit: 'Utwórz',
    success: 'Nowa metryka została pomyślnie utworzona',
    error: 'Nowa metryka nie mogła zostać utworzona'
  },
  removeMetric: {
    title: 'Usuń metrykę',
    confirmation: {
      header: 'Czy na pewno chcesz usunąć tę metrykę?',
      text: 'Usunięcie wskazanej metryki spowoduje usunięcie jej zdefiniowanych wartości w ramach klastrów oraz kursów. Czy na pewno chcesz kontynuwać?'
    },
    success: 'Metryka została pomyślnie usunięta',
    error: 'Metryka nie mogła zostać usunięta'
  },
  errors: {
    "not.found": 'Metric could not be found',
    "delete.exception": 'Metric could not be removed',
  },
  validation: {
    "name.too.short": 'Wybrana nazwa metryki jest zbyt krótka',
    "name.too.long": 'Wybrana nazwa metryki jest zbyt długa',
    "name.invalid.format": 'Nazwa metryki może zawierać jedynie znaki alfanumeryczne oraz znak podłogi',
    "name.required": 'Nazwa metryki jest wymagana',
    "category.empty": 'Wybierz kategorię dla metryki'
  }
}

const clusterMetricValues = {
  table: {
    openMenu: 'Otwórz menu',
    columns: {
      name: 'Nazwa',
      value: 'Wartość',
      unit: 'Jednostka',
    },
    edit: 'Edytuj',
    delete: 'Usuń',
  },
  add: 'Dodaj',
  createClusterMetricValue: {
    title: 'Utwórz nową wartość metryki',
    name: 'Nazwa',
    nameDescription: 'Jest to nazwa metryki dla której definiowana będzie wartość',
    value: 'Wartość',
    valueDescription: 'Wartość jednostki miary nie powinna przekraczać zasobów dostępnych w ramach klastra oVirt',
    unit: 'Jednostka miary',
    unitDescription: 'Jednostka miary wskazująca na wielkość zdefiniowanej wartości metryki',
    select: {
      name: 'Wybierz nazwę metryki',
      unit: 'Wybierz jednostkę miary'
    },
    submit: 'Utwórz nową wartość',
    success: 'Wartość metryki dla danego klastra została utworzona pomyślnie',
    error: 'Wartość metryki dla danego klastra nie mogła zostałać utworzona',
  },
  updateClusterMetricValue: {
    title: 'Zmień wartość metryki',
    value: 'Wartość metryki',
    valueDescription: 'Nowa wartość metryki nie powinna przekraczać całkowitej ilości zasobów w ramach klastra oVirt.',
    unit: 'Jednostka miary',
    unitDescription: 'Jednostka miary określająca wielkość nowej wartości metryki.',
    select: {
      unit: 'Wybierz jednostkę miary'
    },
    submit: 'Modyfikuj',
    success: 'Wartość metryki dla danego klastra została zmodyfikowana pomyślnie',
    error: 'Wartość metryki dla danego klastra nie mogła zostałać zmodyfikowana',
  },
  removeClusterMetricValue: {
    confirmation: {
        header: 'Czy na pewno chcesz usunąć wartość metryki?',
        text: 'Usunięcie wartości metryki jest trwałe. Możliwe będzie zdefniniowanie nowej wartości dla tej metryki. Czy na pewno chcesz kontynuwać?'
    },
    success: 'Wartość metryki dla danego klastra została usunięta pomyślnie',
    error: 'Wartość metryki dla danego klastra nie mogła zostałać usunięta',
  },
  error: {
    "value.not.defined": 'Wartość metryki dla klastra nie została jeszcze zdefniowana',
    "value.already.defined": 'Wartość metryki dla klastra została już zdefniowana',
  },
  validation: {
    "value.negative": 'Wartość metryki nie może być ujemna',
    "metricId.required": 'Określ metrykę dla której tworzona jest wartość',
    "unit.required": 'Wybierz jednostkę miary',
  }
}

const maintenanceIntervals = {
  title: 'Zarządzanie',
  altName: 'Przerwy administracyjne',
  system: {
    name: 'System',
    table: {
      openMenu: 'Otwórz menu',
      columns: {
        cause: 'Przyczyna',
        description: 'Opis',
        start: 'Początek',
        end: 'Koniec',
      },
      remove: 'Usuń',
      finish: 'Zakończ'
    },
  },
  cluster: {
    name: 'Klaster',
    title: 'Przerwy administracyjne dla klastra ',
    table: {
      openMenu: 'Otwórz menu',
      columns: {
        cause: 'Przyczyna',
        description: 'Opis',
        type: 'Typ przerwy',
        start: 'Początek',
        end: 'Koniec',
      },
      remove: 'Usuń',
      finish: 'Zakończ'
    },
  },
  details: {
    title: {
      cluster: 'Przerwa administracyjna dla klastra ',
      system: 'Przerwa administracyjna systemu'
    },
    id: 'Identyfikator',
    cause: 'Powód',
    description: 'Opis',
    type: 'Typ',
    clusterId: 'Identyfikator klastra',
    beginAt: 'Początek',
    endAt: 'Koniec',
    actions: {
      delete: {
        name: 'Usuń',
        title: 'Czy napewno chcesz usunąć przerwę administracyjną',
        description: 'Możliwe będzie zdefniniowanie nowej przerwy administracyjnej'
      },
      finish: {
        name: 'Zakończ',
        title: 'Czy napewno chcesz zakończyć przerwę administracyjną',
        description: 'Przerwa administracyjna zostanie natychmiast zakończona'
      },
      cancel: 'Anuluj'
    },
  },
  calendar: 'Kalendarz',
  active: 'Aktywne przerwy administracyjne',
  createMaintenanceInterval: {
    title: 'Utwórz nową przerwę administracyjną',
    cause: 'Przyczyna',
    causeDescription: 'Ogólnie sformułowana przyczyna przerwy administracyjnej.',
    description: 'Opis',
    descriptionDescription: 'Bardziej szczegółowa informacja o przyczynie przerwy administracyjnej.',
    duration: 'Długość przerwy (godziny)',
    durationDescription: 'Długość przerwy w godzinach od momentu wybranego w kalendarzu, w ramach którego nie będzie dostępna funkcjonalność systemu.',
    submit: 'Utwórz',
    success: 'Przerwa administracyjna została utworzona pomyślnie',
    error: 'Przerwa administracyjna nie mogła zostałać utworzona',
  },
  removeMaintenanceInterval: {
    confirmation: {
      delete: {
        header: 'Czy na pewno chcesz usunąć przerwę administracyjną?',
        text: 'Usunięcie przerwy administracyjnej jest operacją trwałą. Możliwe będzie zdefiniowanie innych przerw administracyjnych w tym czasie. Czy mimo tego chcesz kontynuować?'
      },
      finish: {
        header: 'Czy na pewno chcesz zakończyć przerwę administracyjną?',
        text: 'Zakończenie przerwy administracyjnej jest operacją trwałą. Spowoduje to natychmiastowe zakończenie wybranej przerwy administracyjnej. Czy mimo tego chcesz kontynuować?'
      }
    },
    success: 'Przerwa administracyjna została usunięta pomyślnie',
    error: 'Przerwa administracyjna nie mogła zostałać usunięta',
  },
  error: {
    "not.found": 'Wybrana przerwa administracyjna nie została znaleziona',
    "invalid.time.window": 'Początek przerwy administarcyjnej musi nastąpić przed jej końcem',
    "begin.at.past": 'Przerwa administracyjna musi zaczynać się w przyszłości',
    "conflict": 'Inne przerwy administracyjne już istnieją w wybranym oknie czasowym',
  },
  validation: {
    "cause.too.short": 'Przyczyna przerwy administracyjnej powinna mieć długość co najmniej 4 znaków',
    "cause.too.long": 'Przyczyna przerwy administracyjnej nie może przekroczyć długości 128 znaków',
    "cause.required": 'Powód przerwy administracyjnej stanowi pole obowiązkowe',
    "description.too.long": 'Opis przerwy administracyjnej nie może przekroczyć długości 256 znaków',
    "duration.too.short": 'Minimalna długość przerwy to godzina',
    "duration.too.long": 'Maksymalna długość przerwy nie może przekroczyć 24 godzin',
  },
}

const courses = {
  title: 'Kursy',
  table: {
    openMenu: 'Otwórz menu',
    columns: {
      name: 'Nazwa',
      description: 'Opis',
    },
    showReservations: 'Wyświetl rezerwacje'
  }
}

const reservations = {
  title: 'Rezerwacje',
  altName: 'Rezerwacje',
  calendar: 'Kalendarz',
  active: 'Aktywne rezerwacje',
  table: {
    openMenu: 'Otwórz menu',
    columns: {
      rgName: 'Nazwa grupy zasobów',
      rgType: 'Typ grupy zasobów',
      teamName: 'Nazwa zespołu',
      start: 'Początek rezerwacji',
      end: 'Koniec rezerwacji',
    },
    stateless: 'Bezstanowa',
    stateful: 'Stanowa',
    showDetails: 'Więcej informacji',
  },
  details: {
    title: 'Rezerwacja ',
    tabs: {
      general: 'Ogólne informacje',
      rg: 'Grupa zasobów',
      events: 'Dziennik zdarzeń',
    },
    general: {
      id: 'Identyfikator rezerwacji',
      teamId: 'Identyfikator zespołu',
      teamName: 'Nazwa zespołu',
      rgId: 'Identyfikator grupy zasobów',
      rgName: 'Nazwa grupy zasobów',
      rgState: 'Stan grupy zasobów',
      start: 'Początek',
      startInfo: 'Początek rezerwacji może się opóźnić w wyniku uruchomienia zasobów. Szacowany czas opóźnienia: {{delayTime}} minut.',
      end: 'Koniec',
      endInfo: 'Z powodu konieczności wyłączenia zasobów w ramach danej grupy zasobów, faktyczny koniec rezerwacji następi wcześniej. Szacowany czas wyprzedzenia: {{delayTime}} minut.',
      finishReservation: 'Zakończ rezerwację',
      removeReservation: 'Usuń rezerwację'
    },
    rg: {
      vmId: 'Identyfikator maszyny wirtualnej',
      vmName: 'Nazwa maszyny wirtualnej',
      vmCpuCount: 'Liczba CPU',
      vmMemory: 'Pamięć operacyjna',
      hidden: 'Ukryta',
      ovirt: 'Zobacz maszynę wirtualną w systemie oVirt'
    },
    events: {
      chosenVm: 'Maszyna wirtualna',
      chooseVm: 'Wybierz'
    }
  },
  createReservation: {
    title: 'Utwórz nową rezerwację',
    duration: 'Długość rezerwacji (godziny)',
    durationDescription: 'Długość rezerwacji, od momentu wybranego w ramach kalendarza, w godzinach.',
    automaticStartup: 'Uruchom zasoby w ramach PODa automatycznie',
    notificationTime: 'Czas wysłania powiadomienia przed końcem rezerwacji (min)',
    notificationTimeDescription: 'Określa czas wysłania powiadomienia o nadchodzącym końcu rezerwacji przed jej faktycznym zakończeniem. W przypadku wyboru wartości 0, powiadomienie nie jest wysyłane.',
    submit: 'Utwórz',
    success: 'Rezerwacja została utworzona pomyślnie',
    error: 'Rezerwacja nie mogła zostałać utworzona',
  },
  finishReservation: {
    success: 'Rezerwacja została zakończona pomyślnie',
    error: 'Rezerwacja nie mogła zostałać zakończona',
  },
  error: {
    "end.before.start": "Koniec rezerwacji musi następić po jej rozpoczęciu",
    "start.in.past": "Rezerwacja nie może rozpoczynać się w przeszłości",
    "course.resources.insufficient": "Zasoby kursu są niewystarczające do stworzenia nowej rezerwacji",
    "cluster.resources.insufficient": "Zasoby klastra są niewystarczające do stworzenia nowej rezerwacji",
    "maintenance.interval.conflict": "W trakcie planowanej rezerwacji zdefiniowane są przerwy administracyjne",
    "max.length.exceeded": "Przekroczono maksymalną długość rezerwacji",
    "grace.period.could.not.finish": "Okres karencji planowanej rezerwacji przeciągnąłby się na kolejną rezerwację",
    "grace.period.not.finished": "Okres karencji od ostatniej rezerwacji musi upłynąć",
    "resource.group.already.reserved": "Podana grupa zasobów jest już zarezerwowana",
    "too.short": 'Minimalna długość rezerwacji w systemie eduVirt wynosi 1 godzinę',
  },
  validation: {
    "duration.too.short": 'Wybrana długość rezerwacji jest za króta',
    "duration.too.long": 'Wybrana długość rezerwacji przekracza maksymalny czas rezerwacji',
    "notificationTime.negative": 'Wskazny czas wysłania powiadomienia jest nieprawidłowy',
    "notificationTime.too.long": 'Wskazany czas wysłania powiadomienia przekracza połowę długości rezerwacji',
  },
}

export default {
  clusters, hosts, networks,
  metrics, events, courses,
  clusterMetricValues,
  maintenanceIntervals,
  reservations,
}