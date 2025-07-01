export function getType(obj: any): string {
  const objectType = typeof obj;
  if (Array.isArray(obj)) {
    return getArrayType(obj);
  }
  if (objectType !== "object") {
    return objectType;
  }
  return getObjectType(obj);
}

function getObjectType<T extends {}>(obj: T): string {
  const nestedObjects = Object.entries(obj).reduce(
    (acc, [key, value]) => `${acc}\n${key} :  ${getType(value)},`,
    ""
  );

  return `{\n${nestedObjects}\n}`;
}

function getArrayType(arr: any[]): string {
  if (arr.length === 0) {
    return "[]";
  }
  return `(${arr
    .map(getType)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .reduce((acc, prev) => `${acc} | ${prev}`)})[]`;
}
