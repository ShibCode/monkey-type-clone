export const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};
