import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($email: Email!, $password: AuthPassword!) {
    login(email: $email, password: $password) {
      record {
        id
        name
        email
        channels
        directMessages
        token
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
`;

export const AUTH = gql`
  query {
    token @client
    name @client
    email @client
    id @client
    channels @client
    directMessagesId @client
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

export const REGISTER = gql`
  mutation Register(
    $name: AuthName!
    $email: Email!
    $password: AuthPassword!
  ) {
    register(name: $name, email: $email, password: $password) {
      recordId
      record {
        id
        name
        email
        channels
        directMessages
        token
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
`;

//userId @client - так позначаю параметр який запитую на клієнт, без пошуку на сервері.
export const GET_USERS = gql`
  query users($id: ID) {
    users(id: $id) {
      id
      name
      email
    }
  }
`;
