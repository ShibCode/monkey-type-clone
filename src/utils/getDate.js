var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getDate = () => {
  const rawDate = new Date();

  const date =
    rawDate.getDate().toString().length === 1
      ? `0${rawDate.getDate()}`
      : rawDate.getDate();
  const month = months[rawDate.getMonth()];
  const year = rawDate.getFullYear();

  const fullDate = `${date} ${month} ${year}`;
  return fullDate;
};

export default getDate;
