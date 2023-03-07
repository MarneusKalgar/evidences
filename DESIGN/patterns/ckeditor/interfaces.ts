export interface DataLoader {
  uploadFile(file: File): Promise<string>;
}
