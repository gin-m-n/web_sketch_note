export const hhmmss = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hh = (hours < 10 ? `0${hours}` : hours.toString()) as `${number}`;
  const mm = (minutes < 10 ? `0${minutes}` : minutes.toString()) as `${number}`;
  const ss = (seconds < 10 ? `0${seconds}` : seconds.toString()) as `${number}`;

  return {
    hh,
    mm,
    ss,
  };
};
