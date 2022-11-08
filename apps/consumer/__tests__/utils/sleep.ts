export const sleep = (timeInMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });
