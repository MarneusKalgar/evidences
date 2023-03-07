declare module "@ckeditor/ckeditor5-react" {
  import { Editor } from "@ckeditor/ckeditor5-core";
  import Event from "@ckeditor/ckeditor5-utils/src/eventinfo";
  import { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig";

  interface ClassicEditor extends Editor {
    getData(): string;
  }

  const CKEditor: React.FC<{
    disabled?: boolean;
    editor: ClassicEditor;
    data?: string;
    id?: string;
    config?: EditorConfig;
    onReady?: (editor: ClassicEditor) => void;
    onChange?: (event: Event, editor: ClassicEditor) => void;
    onBlur?: (event: Event, editor: ClassicEditor) => void;
    onFocus?: (event: Event, editor: ClassicEditor) => void;
    onError?: (event: Event, editor: ClassicEditor) => void;
  }>

  export { CKEditor };
}
