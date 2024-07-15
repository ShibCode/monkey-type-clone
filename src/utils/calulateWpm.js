const calculateWpm = (letters, timetaken) => {
  return parseFloat(letters / 5 / (timetaken / 60)).toFixed(2);
};

export default calculateWpm;
