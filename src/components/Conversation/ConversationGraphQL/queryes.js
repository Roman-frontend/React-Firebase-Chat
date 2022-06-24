import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query messages($chatId: ID!, $chatType: ChatType!, $userId: ID!) {
    id @client @export(as: $userId)
    chatId @client @export(as: $chatId)
    activeChatType @client @export(as: $chatType)
    messages(chatId: $chatId, chatType: $chatType, userId: $userId) {
      id
      chatMessages {
        id
        senderId
        text
        replyOn
        replySenderId
        chatType
        chatId
        createdAt
        updatedAt
        status
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation (
    $senderId: ID!
    $text: String!
    $replyOn: String
    $replySenderId: String
    $chatId: ID!
    $chatType: ChatType!
  ) {
    message {
      create(
        chat: { senderId: $senderId, chatId: $chatId, chatType: $chatType }
        text: $text
        replyOn: $replyOn
        replySenderId: $replySenderId
      ) {
        id
        senderId
        text
        replyOn
        replySenderId
        chatId
        chatType
        createdAt
        updatedAt
        status
      }
    }
  }
`;

export const CHANGE_MESSAGE = gql`
  mutation ($input: MessageChangeInput!) {
    message {
      change(input: $input) {
        id
        senderId
        text
        replyOn
        chatId
        chatType
        createdAt
        updatedAt
        status
      }
    }
  }
`;

export const REMOVE_MESSAGE = gql`
  mutation ($id: ID!, $chatType: ChatType!) {
    message {
      remove(id: $id, chatType: $chatType) {
        id
      }
    }
  }
`;
