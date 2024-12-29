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
  name: "Nazwa",
  maxRent: "Maksymalna ilość wypożyczeń",
  maxRentDescription:
    "Określa ile razy grupa zasobów z puli może zostać wypożyczona przez jeden zespół. Ustaw na 0, aby nie ograniczać ilości wypożyczeń.",
  gracePeriod: "Okres karencji (godziny)",
  gracePeriodDescription:
    "Określa ile godzin po zakończeniu wypożyczenia grupa zasobów z puli jest niedostępna dla innych zespołów. Ustaw na 0, aby grupa zasobów była dostępna natychmiast po zakończeniu wypożyczenia.",
  course: "Przedmiot",
  create: "Utwórz",
  success: "Pula grup zasobów została utworzona",
  error: "Nie udało się utworzyć puli grup zasobów",
  validation: {
    nameRequired: "Nazwa jest wymagana",
    maxRentGreaterOrEqualZero:
      "Maksymalna ilość wypożyczeń musi być większa lub równa zero",
    gracePeriodGreaterOrEqualZero:
      "Okres karencji musi być większy lub równy zero",
    courseRequired: "Przedmiot jest wymagany",
  },
  selectCourse: "Wybierz przedmiot",
  noCourses: "Brak przedmiotów",
  searchCourses: "Szukaj przedmiotów",
};

export default {
  courseLimits,
  createResourceGroupPoolModal,
};
