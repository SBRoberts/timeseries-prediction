export const timestampToHumanDate = unixTimeStamp =>
  new Date(unixTimeStamp)
    .toUTCString()
    .split(" ")
    .slice(1, 4)
    .join(" ");

export const timestampToNumberedDate = unixTimeStamp => {
  const date = new Date(unixTimeStamp);

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const timestampToUnix = (timestamp: string) =>
  parseInt((new Date(timestamp).getTime() / 1000).toFixed(0));
