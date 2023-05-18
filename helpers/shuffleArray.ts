/**
 * Shuffles an array using Fisher-Yates shuffle.
 *
 * @see {@link https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array}
 * @see {@link https://bost.ocks.org/mike/shuffle/}
 */
const shuffleArray = <T>(array: T[]): T[] => {
  let m = array.length;
  let t: T;
  let i: number;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

export default shuffleArray;
