export function capitalizeFirstLetters(sentence: string) {
  // Split the sentence into an array of words
  const words = sentence.split(' ').filter((word) => word !== '');

  // Iterate through each word and capitalize the first letter,
  // while lowering the remaining letters
  for (let i = 0; i < words.length; i++) {
    // Lowercase all letters except the first one
    words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
  }

  // Join the words back into a sentence and return it
  return words.join(' ');
}
