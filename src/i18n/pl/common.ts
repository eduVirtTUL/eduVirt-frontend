import adam from "./adam";

const menu = {
  courses: "Przedmioty",
  networks: "Sieci",
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

export default {
  cancel: "Anuluj",
  menu,
  resourceGroupPools,
  ...adam,
};
