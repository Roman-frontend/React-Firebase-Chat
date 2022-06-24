import { useCallback } from 'react';
import { wsSend, wsSingleton } from '../WebSocket/soket';
import {
  reactiveVarToken,
  reactiveVarChannels,
  reactiveDirectMessages,
  reactiveVarEmail,
  reactiveVarId,
  reactiveVarName,
  reactiveVarPrevAuth,
  activeChatId,
  reactiveOnlineMembers,
} from '../GraphQLApp/reactiveVars';
import { useReactiveVar } from '@apollo/client';

export const useAuth = () => {
  const channels = useReactiveVar(reactiveVarChannels);
  const directMessagesId = useReactiveVar(reactiveDirectMessages);
  const userId = useReactiveVar(reactiveVarId);

  const auth = useCallback((data) => {
    reactiveVarToken(data.token);
    reactiveVarName(data.name);
    reactiveVarEmail(data.email);
    reactiveVarId(data.id);
    reactiveVarChannels(data.channels);
    reactiveDirectMessages(data.directMessages);
    reactiveVarPrevAuth(data);
    const toStorage = JSON.stringify(data);
    sessionStorage.setItem('storageData', toStorage);
  }, []);

  const logout = useCallback(() => {
    if (Array.isArray(channels) && Array.isArray(directMessagesId)) {
      const userRooms = channels.concat(directMessagesId);
      wsSend({ userRooms, userId, meta: 'leave' });
    }
    sessionStorage.clear();
    reactiveVarToken('');
    reactiveVarName('');
    reactiveVarEmail('');
    reactiveVarId('');
    reactiveVarChannels([]);
    reactiveDirectMessages([]);
    reactiveVarPrevAuth({});
    activeChatId({});
    reactiveOnlineMembers([]);
  }, []);

  return { auth, logout };
};
