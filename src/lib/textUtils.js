// Pulls the first "quoted" substring out of a command's arguments,
// e.g. interview -q "What is DNS?" -> What is DNS?
// Falls back to the trimmed raw string if there's no quoted segment.
export const extractQuoted = (str) => {
  const match = str.match(/"([^"]*)"/);
  if (match) return match[1];
  return str.trim();
};

// Fisher-Yates shuffle, returns a new array.
export const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
