import * as XLSX from "xlsx";
import { DataExporter } from "./interfaces";

export class ExcelHandler<T> implements DataExporter<T> {
  constructor(
    private data: T[] = [],
    private fileName: string,
    private fieldsToExclude: string[],
  ) {}

  private excludeProperties(dataToMap: T[]) {
    return dataToMap
      .map(item => Object.fromEntries(
        Object.entries(item)
          .filter(([key]) => !this.fieldsToExclude.includes(key))
      ));
  }

  setData(data: T[]) {
    this.data = [...data];
    return this;
  }

  exportData() {
    const dataToExport = this.excludeProperties(this.data);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(workbook, worksheet, this.fileName);
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
  };
}
