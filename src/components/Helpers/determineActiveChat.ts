interface DirectMessage {
  members: string[];
  id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  channels: (string | undefined)[]; // Array<string> | Array<undefined>
  directMessages: (string | undefined)[];
}

type Users = User[] | undefined[];

export function determineActiveChat(
  directMessage: DirectMessage,
  users: Users,
  authId: string
): string | undefined {
  let name: string | undefined;
  const friendId: string =
    directMessage.members[0] === authId
      ? directMessage.members[1]
      : directMessage.members[0];
  for (let user of users) {
    if (user?.id === friendId) {
      name = user.name;
    }
  }
  return name;
}
