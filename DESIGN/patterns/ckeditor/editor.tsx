import { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { KnowledgeBaseBlockInnerProps } from "../../KnowledgeBaseBlockItem";
import { CustomUploadAdapterPlugin } from "./services/UploadAdapter";
import { DataLoadHandler } from "./services/DataLoader";
import { EditorBlockWrapper } from "./EditorBlock.style";

const UPLOAD_IMAGE_BUTTON_NAME = "Insert image";
const EDITOR_CONFIG = {
  mediaEmbed: {
    previewsInData: true,
  }
};

export const EditorBlock = ({
  disabled,
  block,
  blockTypeData,
  setBlockTypeData,
  handleEditorBlockPhoto,
}: KnowledgeBaseBlockInnerProps) => {
  const [editorData, setEditorData] = useState('');
  const apolloClient = useApolloClient();
  const { content } = blockTypeData;
  const { photo } = block;
  const disableUploadImageButton = editorData?.includes("img src") || !!photo;

  const removeUnsavedImage = (data: string) => {
    if (!data.includes("img src") && photo) {
      handleEditorBlockPhoto({
        variables: {
          blockId: block.id,
        },
      });
    }
  }

  useEffect(() => { 
    setEditorData(content);
  }, []);

  useEffect(() => {
    if (editorData?.length > 0) {
      removeUnsavedImage(editorData);
    }

    setBlockTypeData({
      ...blockTypeData,
      content: editorData,
    });
  }, [editorData]);

  return (
    <EditorBlockWrapper
      buttonName={UPLOAD_IMAGE_BUTTON_NAME}
      disableButton={disableUploadImageButton}
    >
      <CKEditor
        editor={ClassicEditor}
        config={EDITOR_CONFIG}
        disabled={disabled}
        data={editorData ?? ""}
        onReady={editor => {
          CustomUploadAdapterPlugin(editor, new DataLoadHandler(apolloClient, block.id));
        }}
        onChange={(_, editor) => {
          setEditorData(editor.getData());
        }}
      />
    </EditorBlockWrapper>
  );
};
