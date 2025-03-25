import { authorizationStorage } from "./FolderStorage";
import { Match } from "./Match";
import { Notes } from "./SeasonUI";

export const getServerHostname = () => {
  return location.host;
};

export async function fetchData(field: string);
export async function fetchData(
  field: string,
  method: string,
  body?: string,
  authorization?: string
);
export async function fetchData(
  field: string,
  method: string = "GET",
  body?: string,
  authorization: string = ""
) {
  return await fetch(`http://${getServerHostname()}/${field}`, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: body,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        "Network response was not ok: " +
          response.statusText +
          ", " +
          response.body
      );
    }
    return response.json();
  });
}

export async function fetchMatchesByCriteria(
  field?: string,
  value?: string
): Promise<Match[]> {
  const searchedField = field && value ? `${field}/${value}` : ``;
  return await fetchData(
    "Matches/" + searchedField,
    "GET",
    undefined,
    authorizationStorage.get() || undefined
  ).then((data) => {
    if (!data) {
      authorizationStorage.remove();
    }
    return data;
  });
}

export async function fetchAllTeamMatches(): Promise<Record<number, Match[]>> {
  const matches: Record<number, Match[]> = {};
  (await fetchMatchesByCriteria()).forEach((match) => {
    matches[match.teamNumber.teamNumber] = [
      ...(matches[match.teamNumber.teamNumber] || []),
      match,
    ];
  });
  return matches;
}

export async function fetchPaticularTeamMatches(
  teams: number[]
): Promise<Record<number, Match[]>> {
  const matches: Record<number, Match[]> = {};
  (await fetchMatchesByCriteria()).forEach((match) => {
    if (teams.includes(match.teamNumber.teamNumber))
      matches[match.teamNumber.teamNumber] = [
        ...(matches[match.teamNumber.teamNumber] || []),
        match,
      ];
  });
  return matches;
}

export async function postMatch(match: Match) {
  return await fetchData("Match", "POST", JSON.stringify(match));
}

export async function fetchTeams(
  teams: number[]
): Promise<Record<number, Match[]>> {
  return await fetchData("Teams", "POST", JSON.stringify({ teams }));
}

export async function fetchQualificationResults() {
  try {
    const response = await fetchData(`TBA/rankings`);
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

export interface MatchTeams {
  blueAlliance: number[];
  redAlliance: number[];
}

export async function fetchAllAwaitingMatches() {
  try {
    const response = await fetchData(`TBA/matches`);
    if (!response) throw new Error("No data received");

    const getTeamNumber = (team: string) => parseInt(team.slice(3));
    const getQual = (match: any) => parseInt((match.key as string).slice(12));

    // Extract qualification rankings from the API response
    const qualificationResults: MatchTeams[] = (response as any[])
      .filter((match) => match.comp_level === "qm")
      .sort((match1, match2) => getQual(match1) - getQual(match2))
      .map((match) => ({
        blueAlliance: match.alliances.blue.team_keys.map(getTeamNumber),
        redAlliance: match.alliances.red.team_keys.map(getTeamNumber),
      }));

    console.log(qualificationResults);

    return qualificationResults;
  } catch (error) {
    console.error("Error fetching qualification results:", error);
    return null;
  }
}

export async function fetchMatchResults(matchNumber: string) {
  try {
    // Call your backend API
    const response = await fetchData(`TBA/match/${matchNumber}`);
    if (!response) throw new Error("No data received");

    // Extract important match details
    const matchResults: MatchResults = {
      matchKey: response.key, // Match identifier
      compLevel: response.comp_level, // Qualification, Quarterfinals, etc.
      redAlliance: response.alliances.red.team_keys, // Red alliance teams
      blueAlliance: response.alliances.blue.team_keys, // Blue alliance teams
      redScore: response.alliances.red.score, // Red alliance score
      blueScore: response.alliances.blue.score, // Blue alliance score
      winningAlliance: response.winning_alliance, // "red", "blue", or ""
      time: response.time
        ? new Date(response.time * 1000).toLocaleString()
        : "N/A", // Match time
    };

    return matchResults;
  } catch (error) {
    console.error("Error fetching match results:", error);
    return null;
  }
}

export async function postNotes(notes: Record<number, Notes>, qual: number) {
  await alert("Started Sending Notes for qual: " + qual);
  return await fetchData(
    `notes/${qual.toString()}`,
    "POST",
    JSON.stringify(notes)
  );
}

export async function fetchNotes(teamNumber: number) {
  return await fetchData(`team_notes/${teamNumber}`);
}

export interface MatchResults {
  matchKey: string;
  compLevel: string;
  redAlliance: string[];
  blueAlliance: string[];
  redScore: number;
  blueScore: number;
  winningAlliance: "red" | "blue";
  time: string;
}
export async function fetchScouterNames() {
  return await fetchData("ScouterNames");
}
