const getTime = () => {
  const rawDate = new Date();

  const hours =
    rawDate.getHours().toString().length === 1
      ? `0${rawDate.getHours()}`
      : rawDate.getHours();
  const minutes =
    rawDate.getMinutes().toString().length === 1
      ? `0${rawDate.getMinutes()}`
      : rawDate.getMinutes();

  const fullTime = `${hours}:${minutes}`;

  return fullTime;
};

export default getTime;
