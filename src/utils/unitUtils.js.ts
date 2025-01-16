export type UnitDefinition = {
  name: string;
  symbol: string;
  conversionFactor: number;
};

export type UnitCategory = {
  label: string;
  key: string;
  units: UnitDefinition[];
}

export type CategoryDefinition = {
  label: string;
  key: string;
}
export const UNIT_CATEGORIES = (): UnitCategory[] => [
  {
    label: "units.memory.name",
    key: "MEMORY",
    units: [
      { name: "units.memory.units.mebibytes.name", symbol: "units.memory.units.mebibytes.symbol", conversionFactor: 1048576 },
      { name: "units.memory.units.gibibytes.name", symbol: "units.memory.units.gibibytes.symbol", conversionFactor: 1073741824 },
      { name: "units.memory.units.tebibytes.name", symbol: "units.memory.units.tebibytes.symbol", conversionFactor: 1099511627776 }
    ]
  },
  {
    label: "units.countable.name",
    key: "COUNTABLE",
    units: [
      { name: "units.countable.units.pieces.name", symbol: "units.countable.units.pieces.symbol", conversionFactor: 1 },
    ]
  }
];

export function getUnitsCategory(categoryKey: string): UnitCategory {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) { throw new Error(`Category with key "${categoryKey}" not found.`) }
  return category;
}

export const getBaseUnit = (categoryKey: string): UnitDefinition => {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) { throw new Error(`Category with key "${categoryKey}" not found.`) }
  return category.units[0]!;
}

export const getBaseUnitValue = (categoryKey: string, value: number): number => {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) { throw new Error(`Category with key "${categoryKey}" not found.`) }
  return value / category.units[0]!.conversionFactor;
}

export function getCategories(): CategoryDefinition[] {
  return UNIT_CATEGORIES().map(({ key, label }) => ({ key, label }));
}

export function getCategory(categoryKey: string): CategoryDefinition {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) {
    throw new Error(`Category with key "${categoryKey}" not found.`);
  }
  return {
    label: category?.label ?? "",
    key: category?.key ?? ""
  }
}

export function convertValue(
  categoryKey: string,
  value: number,
  fromUnit: string
): number {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) {
    throw new Error(`Category with key "${categoryKey}" not found.`);
  }

  const from = category.units.find((unit) => unit.symbol === fromUnit);

  if (!from) {
    throw new Error(`Invalid units: "${fromUnit}" in category "${categoryKey}".`);
  }

  return (value * from.conversionFactor);
}