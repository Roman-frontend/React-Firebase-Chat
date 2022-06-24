import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
} from "../../ConversationGraphQL/queryes";
import { GraphQLError } from "graphql";

// mocks - Тут я просто вказую який результат поверне сервер коли буде зроблено запит з заданими variables. Коли робиться запит з клієнта з такими даними: query: GET_MESSAGES, і з variables: {chatId: "6288671cb24f6a89e861b98d", chatType: "DirectMessage", userId: "client" },
const mocks = [
  {
    request: {
      query: GET_MESSAGES,
      variables: {
        chatId: "6288671cb24f6a89e861b98d",
        chatType: "DirectMessage",
        userId: "6288661c22cf8e8950762e14",
      },
    },
    result: {
      data: {
        activeChatId: "6288671cb24f6a89e861b98d",
        activeChatType: "DirectMessage",
        id: "6288661c22cf8e8950762e14",
        messages: {
          chatMessages: [
            {
              chatId: "6288671cb24f6a89e861b98d",
              chatType: "DirectMessage",
              createdAt: "1653392837121",
              id: "628cc5c56bd4857da0317e96",
              replyOn: null,
              senderId: "6288661c22cf8e8950762e14",
              text: "22",
              updatedAt: "1653392837121",
              status: "delivered",
            },
          ],
          id: "6288671cb24f6a89e861b98d",
        },
      },
      // To simulate GraphQL errors, you define an errors field inside a mock's result field. The value of this field is an array of instantiated GraphQLError objects
      // errors: [new GraphQLError('Error!')],
    },
    // To simulate a network error, you can include an error field in your test's mock object, instead of the result field
    // error: new Error('An error occurred'),
  },
  {
    request: {
      query: CREATE_MESSAGE,
      variables: {
        chatId: "6288671cb24f6a89e861b98d",
        chatType: "DirectMessage",
        senderId: "6288661c22cf8e8950762e14",
        text: "222",
      },
    },
    result: {
      data: {
        message: {
          create: {
            chatId: "6288671cb24f6a89e861b98d",
            chatType: "DirectMessage",
            createdAt: "1653920408799",
            id: "6294d298b2f2005454532ac6",
            replyOn: null,
            senderId: "6288661c22cf8e8950762e14",
            text: "2999",
            updatedAt: "1653920408799",
            status: "delivered",
          },
        },
      },
    },
  },
];

export default mocks;
