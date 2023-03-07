export interface DataExporter<T> {
  setData(data: T[]): void;
  exportData(): void;
}
