const ACTIONS = {
  JOIN: 'join',
  LEAVE: 'leave',
  SHARE_ROOMS: 'share-rooms',
  ADD_PEER: 'add-peer', //ACTIONS.ADD_PEER - Додати нове з'єднання між клієнтами
  REMOVE_PEER: 'remove-peer', //Видаляє з'єднання між клієнтами
  RELAY_SDP: 'relay-sdp', //Рядок для позначення екшина для передачі SDP даних - тобто наші стріми з медіа даними
  RELAY_ICE: 'relay-ice', //Коли ми будемо передавати ice-кандидатів, коли передаватимо фізичні підключення
  ICE_CANDIDATE: 'ice-candidate', //Для реакції на екшини
  SESSION_DESCRIPTION: 'session-description', //Коли прийде нова сесія її треба буде в себе використовувати
};

module.exports = ACTIONS;
