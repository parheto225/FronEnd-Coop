export function listToString(list) {
  return [...list].join(";");
  
}

export function stringToList(str) {
  return str.split(";").map(item => item.trim());
}
