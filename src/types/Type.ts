export function getType<T extends {}>(obj: T) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc += `${key} : `;


    if (Array.isArray(value)) {
      if (value.length === 0) {
        acc += "[]";
      } else if (typeof value[0] === "object") {
        acc += `${getType(value[0])}[]`;
      } else {
        acc += `${typeof value[0]}[]`;
      }
    }
    
    else if (typeof value === "object" && value) {
      acc += `{\n${getType(value)}}`;
    } 
    else {
      acc += typeof value;
    }
    acc += ",\n";
    return acc;
  }, "");
}
