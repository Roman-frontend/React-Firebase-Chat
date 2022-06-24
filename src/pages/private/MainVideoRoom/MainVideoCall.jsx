import { useState, useEffect, useRef } from "react";
import socket from "../../../socket.io";
import ACTIONS from "../../../socket.io/actions";
import { v4 } from "uuid"; //v4 генерує унікальний ід
import { useNavigate } from "react-router-dom";
import defaultVideoWebm from "../../../images/Mail_Digital.webm";
import defaultVideoMp4 from "../../../images/Mail_Digital.mp4";
import posterImage from "../../../images/crispus.jpg";

export default function MainVideoCall() {
  const navigate = useNavigate();
  const [rooms, updateRooms] = useState([]);
  const rootNode = useRef();

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
      // При вході на сторінку підписуємось на event з назвою ACTIONS.SHARE_ROOMS, другим параметром в socket.on - отримуємо всі кімнати які в нас є.
      if (rootNode.current) {
        //Дана перевірка щоб updateRooms виконувався лише коли компонент MainVideoCall вже існує
        updateRooms(rooms); // Щоразу коли приходять кімнати ми будемо обновлювати updateRooms цими кімнатами щоразу коли вони приходять
      }
    });
  }, []);

  return (
    <div ref={rootNode}>
      <h1>Available Rooms</h1>

      <ul>
        {rooms.map(
          (
            roomID //Так виводимо список кімнат
          ) => (
            <li key={roomID}>
              {roomID}
              <button
                onClick={() => {
                  navigate(`/room/${roomID}`); //Дозволяє зайти в відповідну кімнату
                }}
              >
                JOIN ROOM
              </button>
            </li>
          )
        )}
      </ul>

      <button
        onClick={() => {
          navigate(`/room/${v4()}`); //Генеруємо силку з унікальним ід
        }}
      >
        Create New Room
      </button>
      <video
        controls
        muted
        autoPlay
        height={400}
        width="100%"
        poster={posterImage}
      >
        {/* В source - подані різні елементи тегу video якщо не спрацює src-першого то тег video спробує запустити наступний варіант. Черговість іде зверху до низу */}
        <source src={defaultVideoWebm} type="video/webm" />
        <source src={defaultVideoMp4} type="video/mp4" />
      </video>
    </div>
  );
}
