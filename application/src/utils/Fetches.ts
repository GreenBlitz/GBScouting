import { Match } from "./Match";

export const getServerHostname = () => {
  return location.host;
};

export async function fetchData(field: string);
export async function fetchData(field: string, method: string, body: string);
export async function fetchData(
  field: string,
  method: string = "GET",
  body?: string
) {
  return await fetch(`http://${getServerHostname()}/${field}`, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

export async function fetchMatchesByCriteria(field?: string, value?: string): Promise<Match[]> {
  const searchedField = field && value ? `${field}/${value}` : ``;
  return await fetchData("Matches/" + searchedField);
}

export async function postMatch(match: Match) {
  return await fetchData("Match", "POST", JSON.stringify(match));
}
