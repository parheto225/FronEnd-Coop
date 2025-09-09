export function listToString(list) {
  return [...list].join(";");
  
}

export function stringToList(str) {
  return String(str).split(";").map(item => item.trim());
}

export function stringReponseToList(str) {
  return String(str) === "-" ? [] : String(str).replaceAll("[", "")
        .replaceAll("]", "")
        .split(",")
        .map((e) => e.trim());
}
