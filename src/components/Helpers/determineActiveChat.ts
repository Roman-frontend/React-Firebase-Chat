import { DocumentData } from "firebase/firestore";

// interface DirectMessage {
//   members: string[];
//   id: string;
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
//   channels: (string | undefined)[]; // Array<string> | Array<undefined>
//   directMessages: (string | undefined)[];
// }

export function determineActiveChat(
  directMessage: DocumentData,
  users: DocumentData[],
  authId: string | null
): string {
  let name: string = "general";
  if (authId) {
    const friendId: string =
      directMessage.members[0] === authId
        ? directMessage.members[1]
        : directMessage.members[0];
    for (let user of users) {
      if (user?.uid === friendId) {
        name = user.name;
      }
    }
  }

  return name;
}
