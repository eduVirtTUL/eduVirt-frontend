const confirmationDialog = {
  no: "Nie",
  yes: "Tak",
};

const teamDetails = {
  leaveTeam: {
    button: "Opuść zespół",
    confirmHeader: "Opuść zespół",
    confirmText: "Czy na pewno chcesz opuścić ten zespół? Tej akcji nie można cofnąć.",
  },
  course: "Przedmiot:",
  status: "Status:",
  teamMembers: "Członkowie zespołu",
  assignedPods: "Przypisane pody",
  noPods: "Brak przypisanych podów do tego zespołu",
  teamEmpty: "Zespół jest pusty",
  active: "Aktywny",
  inactive: "Nieaktywny",
};

const teamsList = {
  title: "Twoje zespoły",
  table: {
    columns: {
      status: "Status",
      name: "Nazwa",
      course: "Przedmiot",
    },
    active: "Aktywny",
    inactive: "Nieaktywny",
    noTeams: "Nie znaleziono zespołów",
  },
  viewDetails: "Zobacz szczegóły",
};

const podManagement = {
  title: "Zarządzanie podami stanowymi - Zespół",
  resourceGroups: "Grupy zasobów",
  teamPods: "Pody zespołu",
  createPod: "Utwórz pod",
  noPods: "Nie znaleziono podów",
  resourceGroup: "Grupa zasobów",
  alerts: {
    hasAssociatedPod: "Ta grupa zasobów ma już przypisany pod",
    noVMs: "Ta grupa zasobów nie ma żadnych maszyn wirtualnych.",
  },
  delete: {
    button: "Usuń pod",
    confirmHeader: "Usuń pod",
    confirmText: "Czy na pewno chcesz usunąć ten pod?",
  },
};

export default {
  confirmationDialog,
  teamDetails,
  teamsList,
  podManagement,
};
