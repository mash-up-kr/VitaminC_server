export function uniqueBy<T>(arr: T[], toKey: (item: T) => string): T[] {
  return Object.values(
    arr.reduce(
      (acc, item) => {
        acc[toKey(item)] = item;
        return acc;
      },
      {} as Record<string, T>,
    ),
  );
}
