import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { Box } from "@mui/system";
import useWebRTC, { LOCAL_VIDEO } from "../../../hooks/useWebRTC";

//Як усе це працює? Коли користувач заходить на сторінку Room => у нього викликається useParams, ми отримуємо roomId => передаємо його в хук useWebRTC => там useWebRTC захоплює екран через navigator.mediaDevices.getUserMedia => і починає транслювати його на екран через addNewClient(LOCAL_VIDEO... (тобто через цю функцію в нас додається новий клієнт) => на це у нас реагує return цього компоненту (index з папки Room) => всередині useWebRTC ми на localVideoElement видправляємо наш сигнал з localMediaStream прописавши localVideoElement.srcObject = localMediaStream.current; - щоб ми бачили самі себе.

function layout(clientsNumber = 1) {
  //Робить так щоб усі відео помістились на екран. Передаємо в цю функцію кількість наших клієнтів, мінімум один бо мінімум я - той хто створив кімнату буде в кімнати. Так ми зробили масив пар.
  const pairs = Array.from({ length: clientsNumber }).reduce(
    //З clientsNumber створюємо масив і ділимо його на пари з масивами в кожному з якого буде два елемента
    (acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    },
    []
  );

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs
    .map((row, index, arr) => {
      if (index === arr.length - 1 && row.length === 1) {
        //Якщо у нас не парна кількість клієнтів то виконається цей іф
        return [
          {
            width: "100%",
            height,
          },
        ];
      }

      return row.map(() => ({
        //Якщо у нас парна кількість клієнтів то виконається цей return
        width: "50%",
        height,
      }));
    })
    .flat(); //Приводить все це в плоский список, а оскільки в нас один рівень вкладеності то в .flat() нічого не передаємо.
}

export default function Room() {
  const { id: roomID } = useParams();
  const { clients, provideMediaRef } = useWebRTC(roomID);
  const videoLayout = layout(clients.length);
  const [muted, setMuted] = useState(false);
  const [stopVideo, setStopVideo] = useState(true);

  const createVideoWindows = () => {
    return clients.map((clientID, index) => {
      return (
        <Box key={clientID} style={videoLayout[index]} id={clientID}>
          <video // html tag
            //controls - Додає панель управління до відео
            controls
            // loop - Повторює відтворення відео безкінечну кількість разів
            loop={false}
            //poster - силка на зображення яке буде показано до запуску відео
            poster={"https://pixabay.com/images/id-87928/"}
            //preload - використовується для завантаження відео разом із завантаженням сторінки
            preload="auto"
            width="100%"
            height="100%"
            ref={(instance) => {
              provideMediaRef(clientID, instance);
            }}
            // autoPlay - значення цього свойства вказує чи запускати відео після завантаження сторінки
            autoPlay={stopVideo} //Щоб відео автоматично запускалось
            playsInline //Щоб відео автоматично запускалось на кількох мобільних пристроях
            // muted - просто виключає аудіо а не мікрофон.
            muted={clientID === LOCAL_VIDEO || muted} //Так вказуємо що якщо ми самі себе бачимо то ми не хочемо себе чути.
          />
        </Box>
      );
    });
  };

  useEffect(() => {
    createVideoWindows();
  }, [stopVideo, muted]);

  return (
    <Box
      style={{
        display: "flex",
        height: "100vh",
        margin: 0,
      }}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "90vh",
        }}
      >
        {createVideoWindows()}
      </Box>
      <Box
        style={{
          position: "fixed",
          height: "10vh",
          width: "100%",
          bottom: 0,
          background: "gray",
        }}
      >
        <button
          style={{ background: muted ? "red" : "green" }}
          onClick={() => setMuted(!muted)}
        >
          Mute
        </button>
        <button
          style={{ background: stopVideo ? "red" : "green" }}
          onClick={() => setStopVideo(!stopVideo)}
        >
          Video
        </button>
      </Box>
    </Box>
  );
}
