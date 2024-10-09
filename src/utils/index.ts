export function formatStrHorizontalLine(str: string, joinSep: string = "-") {
  return str
    .split(" ")
    .map((item) => item.toLocaleLowerCase())
    .join(joinSep);
}

// Get the first lowercase letter of each word
export function getFirstLetter(str: string, splitSep: string = " ") {
  return str
    .split(splitSep)
    .map((item) => item[0].toLowerCase())
    .join("");
}

export function matchLangrage() {
  const p = globalThis.location?.pathname;
  const lang = p?.match(/\/\w+\/*/);
  return lang?.[0];
}
export function isZhLangrage() {
  return matchLangrage() === "/zh/";
}
