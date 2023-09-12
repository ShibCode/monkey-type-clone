const calculateWpm = (correct, timetaken) => {
  return parseFloat(correct / 5 / (timetaken / 60)).toFixed(2);
};

export default calculateWpm;
