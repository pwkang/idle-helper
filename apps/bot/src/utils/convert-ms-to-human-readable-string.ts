function getYears(milliseconds: number) {

  // Convert milliseconds to seconds
  const seconds = Math.floor(milliseconds / 1000);

  // Calculate the number of years
  return Math.floor(seconds / (365 * 24 * 60 * 60));
}

function getDays(milliseconds: number) {

  // Convert milliseconds to seconds
  const seconds = Math.floor(milliseconds / 1000);

  // Calculate the number of days
  return Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60));
}

function getHours(milliseconds: number) {

  // Convert milliseconds to seconds
  const seconds = Math.floor(milliseconds / 1000);

  // Calculate the number of hours
  return Math.floor(
    ((seconds % (365 * 24 * 60 * 60)) % (24 * 60 * 60)) / (60 * 60)
  );
}

function getMinutes(milliseconds: number) {

  // Convert milliseconds to seconds
  const seconds = Math.floor(milliseconds / 1000);

  // Calculate the number of minutes
  return Math.floor(
    (((seconds % (365 * 24 * 60 * 60)) % (24 * 60 * 60)) % (60 * 60)) / 60
  );
}

function getSeconds(milliseconds: number) {

  // Convert milliseconds to seconds
  let seconds = Math.floor(milliseconds / 1000);

  // Calculate the number of seconds
  seconds =
    (((seconds % (365 * 24 * 60 * 60)) % (24 * 60 * 60)) % (60 * 60)) % 60;

  return seconds;
}

export default function convertMsToHumanReadableString(milliseconds: number) {
  const years = getYears(milliseconds);
  const days = getDays(milliseconds);
  const hours = getHours(milliseconds);
  const minutes = getMinutes(milliseconds);
  const seconds = getSeconds(milliseconds);

  let hasValue = false;
  const stringParts = [];
  if (years > 0 || hasValue) {
    stringParts.push(`${years}y`);
    hasValue = true;
  }
  if (days > 0 || hasValue) {
    stringParts.push(`${days}d`);
    hasValue = true;
  }
  if (hours > 0 || hasValue) {
    stringParts.push(`${hours}h`);
    hasValue = true;
  }
  if (minutes > 0 || hasValue) {
    stringParts.push(`${minutes}m`);
    hasValue = true;
  }
  if (seconds >= 0 || hasValue) {
    stringParts.push(`${seconds}s`);
  }

  return stringParts.join(' ');
}
