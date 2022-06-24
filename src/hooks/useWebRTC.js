import { useEffect, useRef, useCallback, useState } from "react";
import freeice from "freeice";
import useStateWithCallback from "./useStateWithCallback";
import socket from "../socket.io";
import ACTIONS from "../socket.io/actions";

export const LOCAL_VIDEO = "LOCAL_VIDEO";

export default function useWebRTC(roomID) {
  //Приймає ід кімнати
  const [clients, updateClients] = useStateWithCallback([]);

  const addNewClient = useCallback(
    //це updateClients з умовою що в нас користувача не повинно бути в списку clients, тобто якщо він у нас вже під'єднаний то ми вдруге його приєднати вже не можемо.
    (newClient, cb) => {
      //Приймає нового клієнта і колбек. Якщо newClient це функція то list в цій функції це буде state з хука useStateWithCallback
      updateClients((list) => {
        //Якщо state з хуку useStateWithCallback не містить newClient то буде викликано цей if, якщо ж містить то просто повернено state і оскільки state в useStateWithCallback не змінився то useEffect в хуку useStateWithCallback не буде викликано а значить і cb(другий параметр в updateClients) теж не буде викликано при цьому він залишиться як значення cbRef.current
        if (!list.includes(newClient)) {
          //Перевіряємо що якщо в списку клієнтів немає newClient то тоді викликатимо updateClients і передавати далі по цепочці колбек
          return [...list, newClient];
        }

        return list;
      }, cb);
    },
    [clients, updateClients]
  );

  const peerConnections = useRef({}); //peerConnections - зв'язує цього клієнта з іншими клієнтами, це у нас реф оскільки конекшн це мутабельний об'єкт тому ми не можемо зберігати його в стейті тому його не можна робити емутабельним
  const localMediaStream = useRef(null); //localMediaStream силка на даний відео елемент що буде транслюватись з моєї веі камери, тут буде і аудіо
  const peerMediaElements = useRef({
    //Силка на всі відео елементи що будуть в мене на сторінці, щоб можна було приставляти якісь атрибути і якось їх мутувати якимось чином
    [LOCAL_VIDEO]: null, //Додаємо ключ в який будемо записувати наших клієнтів м.д.
  });

  useEffect(() => {
    //Тут описано логіку додавання нового peer
    async function handleNewPeer({ peerID, createOffer }) {
      if (peerID in peerConnections.current) {
        //Якщо ми вже підключені до цього peer тоді ми не підключаємось знову
        return console.warn(`Already connected to peer ${peerID}`);
      }

      peerConnections.current[peerID] = new RTCPeerConnection({
        //Якщо ми не підключені тоді створюємо новий peerConnections
        iceServers: freeice(), //freeice - представляє нам набір адрес безплатних стан серверів.
      });

      peerConnections.current[peerID].onicecandidate = (event) => {
        //Коли у нас новий кандидат бажає підключитись. Тобто коли ми самі по суті створюємо offer або answer
        if (event.candidate) {
          //Ділимось кандидатом з іншими нашими клієнтами.
          socket.emit(ACTIONS.RELAY_ICE, {
            //Транслюємо ice candidate
            peerID,
            iceCandidate: event.candidate,
          });
        }
      };

      let tracksNumber = 0; //Оскільки нам приходить 2 tracks(відео і аудіо) то нам потрібно додавати клієнта лише в тому випадку коли нам прийшло і відео і аудіо то щоразу коли нам приходитиме новий track то ми будемо збільшувати цей tracksNumber
      peerConnections.current[peerID].ontrack = ({
        //Коли нам приходить новий track ми витягуємо стріми які отримуємо
        streams: [remoteStream],
      }) => {
        tracksNumber++; //щоразу коли нам приходитиме новий track то ми будемо збільшувати цей tracksNumber

        if (tracksNumber === 2) {
          //Лиш у випадку коли tracksNumber === 2 ми додамо нового клієнта - тобто якщо нам доступне і відео і аудіо.
          // video & audio tracks received
          tracksNumber = 0;
          addNewClient(peerID, () => {
            if (peerMediaElements.current[peerID]) {
              peerMediaElements.current[peerID].srcObject = remoteStream; //Завдяки цьому ми починаємо транслювати в відео елементі який створився для цього peerId(який намалювався на нашій сторінці) цей remoteStream
            } else {
              // FIX LONG RENDER IN CASE OF MANY CLIENTS
              let settled = false;
              const interval = setInterval(() => {
                if (peerMediaElements.current[peerID]) {
                  peerMediaElements.current[peerID].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        }
      };

      localMediaStream.current.getTracks().forEach((track) => {
        //Експеремент...
        // if (track.kind === 'video') {
        //   track.enabled = !track.enabled;
        // }

        //Получаємо треки які зараз ідуть, тобто які зараз транслюються тобто і аудіо і відео і додати їх до нашого peerConnections
        peerConnections.current[peerID].addTrack(
          //Замість addTrack можна було би використати метод addStream(як я поняв), в який ми могли би відразу прокинути localMediaStream.current, але він не кросбраузерний і на мобільних пристроях він не підтримується тому треба робити так.
          track,
          localMediaStream.current
        );
      });

      if (createOffer) {
        //Якщо нам createOffer потрібен тобто якщо ми створюємо offer, якщо ми сторона яка підключилась в кімнату - тоді нам треба створити цей offer
        const offer = await peerConnections.current[peerID].createOffer(); //Створюємо offer

        await peerConnections.current[peerID].setLocalDescription(offer); //Встановлюємо offer як localDescription - тобто вказати що цей peerConnections буде висилати offer. Коли спрацює цей setLocalDescription в нас автоматично спрацює peerConnections.current[peerID].onicecandidate = (event) => { - і відправить на сервер те що бажає підключитись новий кандидат а також відразу ж після цього відправиться SDP дані тобто дані з - socket.emit(ACTIONS.RELAY_SDP, { і localMediaStream.current.getTracks().forEach((track) => { - тобто tracks цього юзера оскільки їх уже додали в peerConnections. Тут localMediaStream.current.getTracks().forEach((track) => { - додаю  контент що буде відправлятись, а тут socket.emit(ACTIONS.RELAY_SDP, { - відправляю його.

        socket.emit(ACTIONS.RELAY_SDP, {
          //Відправляємо SDP-дані
          peerID,
          sessionDescription: offer, //В випадку створення offer ми відправляємо offer
        });
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.off(ACTIONS.ADD_PEER);
    };
  }, []);

  useEffect(() => {
    //Цей ефект реагуватиме на SESSION_DESCRIPTION
    async function setRemoteMedia({
      peerID,
      sessionDescription: remoteDescription,
    }) {
      await peerConnections.current[peerID]?.setRemoteDescription(
        //Встановлюємо як remoteDescription цьому peerId - sessionDescription яку обернули в конструктор RTCSessionDescription(Насправді він може прийняти і на пряму sessionDescription але в деких браузерах це не працює тому краще обернути в RTCSessionDescription) м.д.
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === "offer") {
        //Оскільки в await peerConnections.current[peerID]?.setRemoteDescription( ми можемо отримувати і offer і answer. То якщо тип remoteDescription це offer то тоді нам треба створити відповідь.
        const answer = await peerConnections.current[peerID].createAnswer(); //Відповідь на offer description

        await peerConnections.current[peerID].setLocalDescription(answer); //Встановлюємо remoteDescription як localDesctiption

        socket.emit(ACTIONS.RELAY_SDP, {
          //Пересилаємо remoteDescription назад на RELAY_SDP
          peerID,
          sessionDescription: answer, //В випадку answer  ми відправляємо answer
        });
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);

    return () => {
      socket.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  useEffect(() => {
    //Тут реагуємо на нового ICE_CANDIDATE
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
      peerConnections.current[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });

    return () => {
      socket.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  useEffect(() => {
    //Тут реагуємо на REMOVE_PEER - тобто коли ми виходимо з кімнати то нам потрібно видалити REMOVE_PEER, зупинити відео(яке ввімкнули ввівши await navigator.mediaDevices.getUserMedia({...) і т.д.
    const handleRemovePeer = ({ peerID }) => {
      if (peerConnections.current[peerID]) {
        //Якщо в peerConnections.current є свойство peerID
        peerConnections.current[peerID].close(); //Закриваємо peerConnections.current[peerID]
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients((list) => list.filter((c) => c !== peerID));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  useEffect(() => {
    //Тут відбувається підключення до кімнати. Тобто це буде виконуватись при підключені даного клієнта до кімнати
    async function startCapture() {
      //Робимо захват екрану
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        //Слідкуємо за нашим localMediaStream і запишемо туда navigator.mediaDevices.getUserMedia - тобто так ми захопимо медіа контент
        audio: true, //Вказуємо що необхідно захоплювати звук, якщо false то не буде приймати звук
        video: {
          //Можна цьому методу просто задати false так: video: false - і тоді відео не запитуватиме
          //Так вказуємо що треба захорпити відео
          width: 1280, //Так вказуємо формат відео в даному випадку 1280х720
          height: 720,
        },
      });

      addNewClient(LOCAL_VIDEO, () => {
        // Якщо захват екрану відбувся успішно то викличеться ця функція. Тут описано що буде відбуватися коли ми додали нового клієнта в LOCAL_VIDEO (в локал відео) - він відрендериться в нас і всередині рендера ми його запишемо в список наших peerMediaElements з ключем LOCAL_VIDEO
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO]; //Дістаємо дані з об'єкту peerMediaElements зі свойства LOCAL_VIDEO

        if (localVideoElement) {
          //Якщо localVideoElement містить якісь дані то це вже буде html тег відео до якого ми отримуємо доступ через реф
          localVideoElement.volume = 0; //присвоюємо 0 щоб ми самі себе не чули.
          localVideoElement.srcObject = localMediaStream.current; //localMediaStream.current - те що ми захопили з вебкамери і з мікрофону передаємо на відеоелемент який ми відмалювали, хоча тут ми його ще поки не відмалювали, а лиш додали в список clients, ми відреагуємо на його в середині нашого компоненту
        }
      });
    }

    startCapture() //Після захвату екрану викликатимо socket.emit для підключення до кімнати і передаватимо туди до якої кімнати треба підключитись
      .then(() => socket.emit(ACTIONS.JOIN, { room: roomID })) //startCapture запитає користувача чи бажає він включити відео і тільки якщо він дасть згоду його підключать до кімнати тобто логіка перейде до цього then.
      .catch((e) => console.error("Error getting userMedia:", e)); //Якщо користувач не дозволив ввімкнути камеру то буде спрацьовувати цей кетч

    return () => {
      //Додаємо логіку виходу з кімнати коли у нас компонент MainVideoCall демонтується.
      localMediaStream.current.getTracks().forEach((track) => track.stop()); //Коли в нас змінюється ід кімнати то зупиняємо захват відео і аудіо. .getTracks() - поверне всі треки що в нас є у вигляді масиву. .forEach((track) => track.stop()); - зупиняє цей трек.

      socket.emit(ACTIONS.LEAVE); //Вийти з кімнати якщо в нас вдруг кімната помінялась або мі пішли з кімнати демонтувавши цей компонент.
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id, node) => {
    peerMediaElements.current[id] = node;
  }, []);

  return {
    clients,
    provideMediaRef,
  };
}
