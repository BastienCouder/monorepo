export function filterColumn({ value }: { value: string }) {
  const [filterValue, filterVariety] = value?.split('.') ?? [];

  switch (filterVariety) {
    case 'contains':
      return { contains: filterValue };
    case 'does not contain':
      return { NOT: { contains: filterValue } };
    case 'is':
      return { equals: filterValue };
    case 'is not':
      return { NOT: { equals: filterValue } };
    default:
      return { contains: filterValue };
  }
}
