import React, {
  useState,
  useMemo,
  useEffect,
  Profiler,
  memo,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
import Message from "./Message/Message";
import { Loader } from "../../Helpers/Loader";
import { IMapedMessage } from "../Models/IMessage";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  openPopup: string;
  setOpenPopup: Dispatch<SetStateAction<string>>;
  setPopupMessage: Dispatch<SetStateAction<null | IMapedMessage>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
}

export const Messages = memo(
  ({
    openPopup,
    setOpenPopup,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  }: IProps) => {
    const { activeChannelId, activeDirectMessageId } = useContext(ChatContext);
    const firestore = useFirestore();
    const [messages, setMessages] = useState<DocumentData[]>([]);

    useEffect(() => {
      const activeChatId = activeChannelId
        ? activeChannelId
        : activeDirectMessageId;
      const chatType = activeChannelId ? "channels" : "directMessages";
      const q = query(
        collection(firestore, `${chatType}/${activeChatId}/messages`),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: DocumentData[] = [];
        snapshot.docs.forEach((snap) => {
          results.push({ ...snap.data() });
        });
        if (Array.isArray(results)) {
          setMessages(results);
        }
      });

      return () => unsubscribe();
    }, [firestore, activeChannelId, activeDirectMessageId]);

    const callback = (
      _id: string,
      _phase: string,
      _actualTime: number,
      _baseTime: number,
      _startTime: number,
      _commitTime: number
    ) => {
      //console.log(`${id}'s ${phase} phase:`);
    };

    const renderMessages = useCallback(() => {
      if (Array.isArray(messages)) {
        const chatMsgs = messages;
        const arrayOfArrMsgs: IMapedMessage[][] = [];
        let indexGroup: number = 0;
        chatMsgs.forEach((m: DocumentData, index: number) => {
          if (index > 0 && m.senderId === chatMsgs[index - 1].senderId) {
            return arrayOfArrMsgs[indexGroup].unshift({ ...m });
          }
          arrayOfArrMsgs.push([{ ...m }]);
          indexGroup = arrayOfArrMsgs.length - 1;
        });

        const arrMessages = arrayOfArrMsgs.map((arrMsgs: IMapedMessage[]) => {
          return (
            <Profiler id="Message" key={arrMsgs[0].id} onRender={callback}>
              <Message
                key={arrMsgs[0].id}
                arrMsgs={arrMsgs}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                setPopupMessage={setPopupMessage}
                setCloseBtnChangeMsg={setCloseBtnChangeMsg}
                setCloseBtnReplyMsg={setCloseBtnReplyMsg}
              />
            </Profiler>
          );
        });

        return arrMessages.reverse();
      }
      return null;
    }, [messages, openPopup]);

    return <>{renderMessages()}</>;
  }
);
