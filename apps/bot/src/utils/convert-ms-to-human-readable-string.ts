export default function convertMsToHumanReadableString(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(months / 12);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 60;
  days = days % 30;
  months = months % 12;
  years = years % 12;

  const time = [years, months, days, hours, minutes, seconds];
  const timeUnit = ['y', 'm', 'd', 'h', 'm', 's'];

  let timeString = '';
  for (let i = 0; i < time.length; i++) {
    if (time[i] > 0 || timeString !== '') {
      timeString += `${time[i]}${timeUnit[i]} `;
    }
  }

  return timeString;
}
