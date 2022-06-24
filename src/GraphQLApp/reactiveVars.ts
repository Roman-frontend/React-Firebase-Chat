import { makeVar } from '@apollo/client';

interface IStorage {
  id: string;
  name: string;
  email: string;
  token: string;
  channels: [] | string[];
  directMessages: [] | string[];
}

type Storage = null | string | IStorage;

const storage: Storage = sessionStorage.getItem('storageData');
let parsedStorage: null | IStorage = null;
if (storage) {
  parsedStorage = JSON.parse(storage);
}

export const reactiveVarToken =
  parsedStorage && parsedStorage.hasOwnProperty('token')
    ? makeVar<string>(parsedStorage.token)
    : makeVar<string>('');
export const reactiveVarName =
  parsedStorage && parsedStorage.hasOwnProperty('name')
    ? makeVar<string>(parsedStorage.name)
    : makeVar<string>('');
export const reactiveVarEmail =
  parsedStorage && parsedStorage.hasOwnProperty('email')
    ? makeVar<string>(parsedStorage.email)
    : makeVar<string>('');
export const reactiveVarId =
  parsedStorage && parsedStorage.hasOwnProperty('id')
    ? makeVar<string>(parsedStorage.id)
    : makeVar<string>('');
export const reactiveDirectMessages =
  parsedStorage && parsedStorage.hasOwnProperty('directMessages')
    ? makeVar<string[] | []>(parsedStorage.directMessages)
    : makeVar<string[] | []>([]);
export const reactiveVarChannels =
  parsedStorage && parsedStorage.hasOwnProperty('channels')
    ? makeVar<string[] | []>(parsedStorage.channels)
    : makeVar<string[] | []>([]);
export const activeChatId = makeVar({
  activeChannelId: '',
  activeDirectMessageId: '',
});
export const reactiveOnlineMembers = makeVar<string[] | []>([]);
export const reactiveVarPrevAuth = makeVar<object>({});
