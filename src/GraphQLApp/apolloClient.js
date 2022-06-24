import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import {
  reactiveVarName,
  reactiveVarToken,
  reactiveVarEmail,
  reactiveVarId,
  reactiveDirectMessages,
  reactiveVarChannels,
  reactiveOnlineMembers,
  reactiveVarPrevAuth,
  activeChatId,
} from "./reactiveVars";

//const httpLink = createHttpLink({ uri: '/graphql' });
const httpLink = new HttpLink({ uri: "http://localhost:3000/graphql" });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
  const auth = JSON.parse(sessionStorage.getItem("storageData"));
  // return the headers to the context so httpLink can read them
  const token = auth?.token || "";
  return { headers: { ...headers, authorization: token } };
});

const link = authLink.concat(httpLink);

export const client = new ApolloClient({
  //link: authLink.concat(httpLink),
  //link: from([errorLink, httpLink]),
  link: from([errorLink, link]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          directMessagesId() {
            return reactiveVarToken() ? reactiveDirectMessages() : null;
          },
          channels() {
            return reactiveVarToken() ? reactiveVarChannels() : null;
          },
          token() {
            return reactiveVarToken();
          },
          name() {
            return reactiveVarToken() ? reactiveVarName() : null;
          },
          email() {
            return reactiveVarToken() ? reactiveVarEmail() : null;
          },
          id() {
            // console.log("id: ", reactiveVarToken() ? reactiveVarId() : null);
            return reactiveVarToken() ? reactiveVarId() : null;
          },
          usersOnline() {
            return reactiveVarToken() ? reactiveOnlineMembers() : null;
          },
          activeChannelId() {
            // console.log("activeChannelId: ", reactiveVarToken() ? activeChatId()?.activeChannelId : null)
            return reactiveVarToken() ? activeChatId()?.activeChannelId : null;
          },
          activeDirectMessageId() {
            return reactiveVarToken()
              ? activeChatId()?.activeDirectMessageId
              : null;
          },
          chatId() {
            // console.log(
            //   "activeChatId: ",
            //   reactiveVarToken(),
            //   activeChatId()?.activeChannelId,
            //   reactiveVarToken()
            //     ? activeChatId()?.activeChannelId ||
            //         activeChatId()?.activeDirectMessageId
            //     : null
            // );
            // return "6288671cb24f6a89e861b98d";
            return reactiveVarToken()
              ? activeChatId()?.activeChannelId ||
                  activeChatId()?.activeDirectMessageId
              : null;
          },
          activeChatType() {
            // console.log(
            //   "activeChatType reactiveVarToken: ",
            //   reactiveVarToken()
            // );
            if (reactiveVarToken()) {
              // console.log(
              //   "activeChatId()?.activeChannelId: ",
              //   activeChatId()?.activeChannelId,
              //   "activeChatId()?.activeDirectMessageId: ",
              //   activeChatId()?.activeDirectMessageId
              // );
              if (activeChatId()?.activeChannelId) {
                return "Channel";
              } else if (activeChatId()?.activeDirectMessageId) {
                return "DirectMessage";
              }
            }
            return null;
          },
          emailTo() {
            return "romalicevich@gmail.com";
          },
        },
      },
    },
  }),
  resolvers: {},
  connectToDevTools: true,
});
