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
    label: "units.memory.nonVolatile.name",
    key: "NON_VOLATILE_MEMORY",
    units: [
      { name: "units.memory.nonVolatile.units.bytes.name", symbol: "units.memory.nonVolatile.units.bytes.symbol", conversionFactor: 1 },
      { name: "units.memory.nonVolatile.units.kilobytes.name", symbol: "units.memory.nonVolatile.units.kilobytes.symbol", conversionFactor: 1000 },
      { name: "units.memory.nonVolatile.units.megabytes.name", symbol: "units.memory.nonVolatile.units.megabytes.symbol", conversionFactor: 1000000 },
      { name: "units.memory.nonVolatile.units.gigabytes.name", symbol: "units.memory.nonVolatile.units.gigabytes.symbol", conversionFactor: 1000000000 },
      { name: "units.memory.nonVolatile.units.terabytes.name", symbol: "units.memory.nonVolatile.units.terabytes.symbol", conversionFactor: 1000000000000 },
    ]
  },
  {
    label: "units.memory.volatile.name",
    key: "VOLATILE_MEMORY",
    units: [
      { name: "units.memory.volatile.units.bytes.name", symbol: "units.memory.volatile.units.bytes.symbol", conversionFactor: 1 },
      { name: "units.memory.volatile.units.kibibytes.name", symbol: "units.memory.volatile.units.kibibytes.symbol", conversionFactor: 1024 },
      { name: "units.memory.volatile.units.mebibytes.name", symbol: "units.memory.volatile.units.mebibytes.symbol", conversionFactor: 1048576 },
      { name: "units.memory.volatile.units.gibibytes.name", symbol: "units.memory.volatile.units.gibibytes.symbol", conversionFactor: 1073741824 },
      { name: "units.memory.volatile.units.tebibytes.name", symbol: "units.memory.volatile.units.tebibytes.symbol", conversionFactor: 1099511627776 }
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
  if (!category) {
      throw new Error(`Category with key "${categoryKey}" not found.`);
  }
  return category;
}

export const getBaseUnitForCategory = (categoryKey: string): UnitDefinition => {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) {
    throw new Error(`Category with key "${categoryKey}" not found.`);
  }
  return category.units[0]!;
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
  fromUnit: string,
  toUnit: string
): number {
  const category = UNIT_CATEGORIES().find((c) => c.key === categoryKey);
  if (!category) {
    throw new Error(`Category with key "${categoryKey}" not found.`);
  }

  const from = category.units.find((unit) => unit.symbol === fromUnit);
  const to = category.units.find((unit) => unit.symbol === toUnit);

  if (!from || !to) {
    throw new Error(`Invalid units: "${fromUnit}" or "${toUnit}" in category "${categoryKey}".`);
  }

  return (value * from.conversionFactor) / to.conversionFactor;
}