import { Editor } from "@ckeditor/ckeditor5-core";
import {
  FileLoader,
  UploadAdapter as IUploadAdapter,
} from "@ckeditor/ckeditor5-upload/src/filerepository";
import { DataLoader } from "./interfaces";

class UploadAdapter implements UploadAdapter {
  constructor(private loader: FileLoader, private dataLoader: DataLoader) {}

  async upload() {
    const file: File = await this.loader.file;

    if (file.size / 1024 / 1024 > 5) {
      throw new Error("Пожалуйста загрузите файл менее 5МБ");
    }

    try {
      const data = await this.dataLoader.uploadFile(file);
      return { default: data };
    } catch (e) {
      throw new Error("При загрузке фото произошла ошибка");
    }
  }

  abort() {}
}

export const CustomUploadAdapterPlugin = (editor: Editor, dataLoader: DataLoader) => {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: FileLoader) => {
    return new UploadAdapter(loader, dataLoader);
  }
}
