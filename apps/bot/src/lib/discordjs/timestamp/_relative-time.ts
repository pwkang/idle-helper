export interface IDynamicTimeStamp {
  time: number | Date;
}

export default function _relativeTime({time}: IDynamicTimeStamp) {
  const timestamp = new Date(time);
  return `<t:${Math.floor(timestamp.getTime() / 1000)}:R>`;
}
