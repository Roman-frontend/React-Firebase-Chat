export const messageDate = (date = Date.now()) => {
  const rowDate = new Date(parseInt(date));
  const hour = rowDate.getHours();
  const minute =
    rowDate.getMinutes() > 9
      ? rowDate.getMinutes()
      : `0${rowDate.getMinutes()}`;
  const second =
    rowDate.getSeconds() > 9
      ? rowDate.getSeconds()
      : `0${rowDate.getSeconds()}`;
  let result = "";
  result += hour + ":" + minute + ":" + second;
  return result;
};
