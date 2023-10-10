const conjunctionWords = [
  "and",
  "but",
  "or",
  "nor",
  "for",
  "so",
  "yet",
  "although",
  "because",
  "since",
  "unless",
  "while",
  "to",
  "at",
];
function capitalize(text = "", separator = " ") {
  const tempText = text.split(separator);
  tempText.forEach((text, index) => {
    if (!conjunctionWords.includes(text)) {
      tempText[index] = text.charAt(0).toUpperCase() + text.slice(1);
    }
  });
  return tempText.join(" ");
}

function convertText(text) {
  if (text.includes(" ")) {
    return text.toLowerCase().split(" ").join("_");
  } else {
    return text.toLowerCase().split("_").join(" ");
  }
}

function removeUnderscore(text) {
  return text.replace(/_/g, " ");
}
function getPath() {
  return window.location.pathname;
}
function createBreadCrumb(path = "") {
  let tempString = path.substring(1);
  return tempString.split("/");
}
function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

export const useFunction = () => {
  return {
    capitalize,
    convertText,
    getPath,
    createBreadCrumb,
    removeUnderscore,
    generateRandomString,
  };
};
