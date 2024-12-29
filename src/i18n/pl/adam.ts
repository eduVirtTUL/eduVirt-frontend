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

export default {
  courseLimits,
};
