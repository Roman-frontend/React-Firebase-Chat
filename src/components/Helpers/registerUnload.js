import { wsSend, wsSingleton } from "../../WebSocket/soket";
import { reactiveOnlineMembers } from "../../GraphQLApp/reactiveVars";

function online() {
  wsSingleton.clientPromise
    .then((wsClient) => console.log("ONLINE"))
    .catch((error) => console.log(error));
  const storage = JSON.parse(sessionStorage.getItem("storageData"));
  if (storage?.channels && storage?.directMessages) {
    const allUserChats = storage.channels.concat(storage.directMessages);
    wsSend({
      userRooms: allUserChats,
      meta: "join",
      userId: storage.id,
    });
  }
}

export function registerEnterPage() {
  //console.info(performance.navigation.type);
  if (performance?.navigation?.type == performance.navigation.TYPE_RELOAD) {
    console.log("online...", performance?.navigation?.type);
    online();
    //console.info('This page is reloaded');
  } else if (window.performance) {
    console.log("window.performance: ", window.performance);
    //check for Navigation Timing API support
    // console.info("window.performance works fine on this browser");
    online();
  } else {
    //console.info('This page is not reloaded');
  }
}

export function registerOnlineUser(usersOnline) {
  return wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.addEventListener("message", (response) => {
        const parsedRes = JSON.parse(response.data);
        if (
          parsedRes.message === "online" &&
          JSON.stringify(usersOnline) !== JSON.stringify(parsedRes.members)
        ) {
          reactiveOnlineMembers(parsedRes.members);
        }
      });
    })
    .catch((error) => console.log(error));
}

export function registerUnloadPage(msg, onunloadFunc) {
  let alreadPrompted = false,
    timeoutID = 0,
    reset = function () {
      alreadPrompted = false;
      timeoutID = 0;
    };

  if (msg || onunloadFunc) {
    // register
    window.onbeforeunload = function () {
      if (msg && !alreadPrompted) {
        alreadPrompted = true;
        timeoutID = setTimeout(reset, 100);
        return msg;
      }
    };

    window.onunload = function () {
      clearTimeout(timeoutID);
      if (onunloadFunc) onunloadFunc();
    };
  } else {
    // unregister
    window.onbeforeunload = null;
    window.onunload = null;
  }
}

export function registerOfflineUser() {
  console.log("registerOfflineUser ~~~ ");
  const storageData = JSON.parse(sessionStorage.getItem("storageData"));
  if (storageData && storageData.channels[0]) {
    const allUserChats = storageData.channels.concat(
      storageData.directMessages
    );
    wsSend({
      userRooms: allUserChats,
      userId: storageData.id,
      meta: "leave",
      path: "Conversation",
    });
  }
}
