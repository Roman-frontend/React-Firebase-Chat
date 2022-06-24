import { gql } from "@apollo/client";

export const GET_DIRECT_MESSAGES = gql`
  query directMessages($id: [ID]) {
    directMessagesId @client @export(as: "id")
    directMessages(id: $id) {
      id
      members
    }
  }
`;

export const CREATE_DIRECT_MESSAGE = gql`
  mutation ($inviter: ID!, $invited: [ID]!) {
    directMessages {
      create(inviter: $inviter, invited: $invited) {
        recordId
        record {
          id
          members
        }
        status
        query {
          users {
            id
          }
        }
        error {
          message
          __typename
          ... on ValidatorError {
            path
            value
          }
          ... on MongoError {
            code
          }
          ... on AuthError {
            value
            code
          }
        }
      }
    }
  }
`;

export const REMOVE_DIRECT_MESSAGE = gql`
  mutation ($id: ID!) {
    directMessages {
      remove(id: $id) {
        recordId
        record {
          id
          members
        }
        status
        error {
          message
          __typename # <--- Client will receive error type name
          ... on ValidatorError {
            # <--- Request additional fields according to error type
            path
            value
          }
          ... on MongoError {
            code
          }
          ... on AuthError {
            value
            code
          }
        }
      }
    }
  }
`;

// export const APP = gql`
//   {
//     usersOnline @client
//     activeChannelId @client
//     activeDirectMessageId @client
//     activeChatId @client
//     activeChatType @client
//   }
// `;

export const CHANNELS = gql`
  query userChannels($channelsId: [ID], $userId: ID!) {
    channels @client @export(as: "channelsId")
    id @client @export(as: "userId")
    userChannels(channelsId: $channelsId, userId: $userId) {
      id
      name
      admin
      members
      isPrivate
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation (
    $admin: ID!
    $discription: String
    $isPrivate: Boolean
    $members: [ID]!
    $name: String!
  ) {
    channel {
      create(
        details: {
          admin: $admin
          discription: $discription
          isPrivate: $isPrivate
          name: $name
        }
        members: $members
      ) {
        id
        name
        admin
        members
        isPrivate
      }
    }
  }
`;

export const ADD_MEMBER_CHANNEL = gql`
  mutation ($invited: [ID]!, $chatId: ID!) {
    channel {
      addMember(invited: $invited, chatId: $chatId) {
        id
        members
      }
    }
  }
`;

export const REMOVE_CHANNEL = gql`
  mutation ($channelId: ID!, $userId: ID!) {
    channel {
      remove(channelId: $channelId, userId: $userId) {
        recordId
        status
        error {
          message
          __typename # <--- Client will receive error type name
          ... on ValidatorError {
            # <--- Request additional fields according to error type
            path
            value
          }
          ... on MongoError {
            code
          }
          ... on AuthError {
            value
            code
          }
        }
      }
    }
  }
`;

export const SEND_TO_GMAIL = gql`
  query sendToGmail(
    $from: String!
    $to: String!
    $subject: String
    $text: String
  ) {
    email @client @export(as: "from")
    emailTo @client @export(as: "to")
    sendToGmail(from: $from, to: $to, subject: $subject, text: $text) {
      status
      message
    }
  }
`;
