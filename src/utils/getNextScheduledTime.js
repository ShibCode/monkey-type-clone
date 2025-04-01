export const getNextScheduledTime = (baseTime, intervalMinutes) => {
  const now = new Date();
  let target = new Date(baseTime);

  // If the target time is in the past, increment it by the interval until it's in the future
  if (now >= target) {
    const nowMs = now.getTime();
    let targetMs = target.getTime();
    const intervalMs = intervalMinutes * 60 * 1000;

    // Calculate the smallest future target time directly
    const diff = nowMs - targetMs;
    const intervalsPassed = Math.ceil(diff / intervalMs);
    targetMs += intervalsPassed * intervalMs;

    target = new Date(targetMs);
  }

  return target;
};
