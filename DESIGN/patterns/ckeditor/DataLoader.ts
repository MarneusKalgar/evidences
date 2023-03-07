import { ApolloClient } from "@apollo/client";
import { HandleKnowledgeBaseBlockEditorPhotoDocument } from "../../../../../generated/graphql";
import { DataLoader } from "./interfaces";

export class DataLoadHandler implements DataLoader {
  constructor(private apolloClient: ApolloClient<any>, private blockId: string) {}

  async uploadFile(file: File) {
    const { data } = await this.apolloClient.mutate({
      mutation: HandleKnowledgeBaseBlockEditorPhotoDocument,
      variables: {
        blockId: this.blockId,
        photo: file,
      },
    });

    return data.handleKnowledgeBaseBlockEditorPhoto.photo;
  }
}
