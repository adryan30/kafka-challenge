import { sleep } from "./sleep";
type waitForOptions = {
  delay?: number;
  maxWait?: number;
  timeoutMessage?: string;
  ignoreTimeout?: boolean;
};

export const waitFor = (
  fn: Function,
  {
    delay = 50,
    maxWait = 10000,
    timeoutMessage = "Promise was not fulfilled",
    ignoreTimeout = false,
  }: waitForOptions = {}
) => {
  let timeoutId;
  let totalWait = 0;
  let fulfilled = false;

  const checkCondition = async (resolve, reject) => {
    totalWait += delay;
    await sleep(delay);

    try {
      const result = await fn(totalWait);
      if (result) {
        fulfilled = true;
        clearTimeout(timeoutId);
        return resolve(result);
      }
      checkCondition(resolve, reject);
    } catch (e) {
      fulfilled = true;
      clearTimeout(timeoutId);
      reject(e);
    }
  };

  return new Promise<boolean>((resolve, reject) => {
    checkCondition(resolve, reject);
    if (ignoreTimeout) return;
    timeoutId = setTimeout(() => {
      if (!fulfilled) {
        return reject(new Error(timeoutMessage));
      }
    }, maxWait);
  });
};
