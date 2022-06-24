import { useState, useCallback, useRef, useEffect } from 'react';

//Це по суті аналог this.setState із класових компонентів
const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState); //Тут setState на пряму ми не чіпаємо
  const cbRef = useRef(null);

  //useCallback з [] як залежність дозволяє не перезагружати функцію після повторному рендерингу хуку
  const updateState = useCallback((newState, cb) => {
    //Експортимо updateState що приймає новий стейт і колбек
    cbRef.current = cb; //колбек зберігає в реф

    setState((prev) =>
      typeof newState === 'function' ? newState(prev) : newState
    ); // викликає цей сетстейт(обновлення функції) Після того як обновлення сталось, стейт змінився, спрацьовує useEffect
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state); //Коли стейт змінився, викликається колбек що записаний в useRef якщо він там є
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};

export default useStateWithCallback;
