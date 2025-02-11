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

export async function fetchMatchesByCriteria(field?: string, value?: string) {
  const searchedField = field && value ? `${field}/${value}` : ``;
  return await fetchData("Matches/" + searchedField);
}

export async function postMatch(match: Match) {
  return await fetchData("Match", "POST", JSON.stringify(match));
}

export async function fetchQualificationResults(eventKey: string) {
  try {
    const response = await fetchData(`TheBlueAlliance-event-leaderboard/${eventKey}`);
    if (!response) throw new Error("No data received");

    // Extract qualification rankings from the API response
    const qualificationResults = response.rankings?.map((team: any) => ({
      teamNumber: team.team_key, // FRC team number
      rank: team.rank,
      record: team.record, // Wins/Losses/Ties
      dq: team.dq, // Disqualifications
      matchesPlayed: team.matches_played,
      rankingScore: team.sort_orders?.[0], // First sorting order (ranking points)
    }));

    return qualificationResults;
  } catch (error) {
    console.error("Error fetching qualification results:", error);
    return null;
  }
}

export async function fetchMatchResults(matchKey: string) {
  try {
    // Call your backend API
    const response = await fetchData(`TheBlueAlliance-match-results/${matchKey}`);
    if (!response) throw new Error("No data received");

    // Extract important match details
    const matchResults = {
      matchKey: response.key, // Match identifier
      compLevel: response.comp_level, // Qualification, Quarterfinals, etc.
      redAlliance: response.alliances.red.team_keys, // Red alliance teams
      blueAlliance: response.alliances.blue.team_keys, // Blue alliance teams
      redScore: response.alliances.red.score, // Red alliance score
      blueScore: response.alliances.blue.score, // Blue alliance score
      winningAlliance: response.winning_alliance, // "red", "blue", or ""
      time: response.time ? new Date(response.time * 1000).toLocaleString() : "N/A", // Match time
    };

    return matchResults;
  } catch (error) {
    console.error("Error fetching match results:", error);
    return null;
  }
}
