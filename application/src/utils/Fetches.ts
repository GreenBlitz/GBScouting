import { authorizationStorage, matchesStorage } from "./FolderStorage";
import { Match } from "./Match";
import { QualNotes } from "./SeasonUI";

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
  return await fetch(`${location.protocol}/${field}`, {
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
          response.statusText.toString() +
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

export type TBAClimbMatch = {
  red: Record<number, string>;
  blue: Record<number, string>;
  qual: number;
};

export async function fetchClimbs(): Promise<TBAClimbMatch[]> {
  try {
    const response = await fetchData(`TBA/Climb`);
    if (!response) throw new Error("No data received");

    return response;
  } catch (error) {
    console.error("Error fetching climb results:", error);
    return [];
  }
}

export interface MatchTeams {
  blueAlliance: number[];
  redAlliance: number[];
}

export async function fetchAllAwaitingMatches() {
  try {
    return [
      {
        redAlliance: [3211, 1943, 5951],
        blueAlliance: [4590, 9738, 5928],
      },
      {
        redAlliance: [9991, 3083, 3339],
        blueAlliance: [5654, 8223, 4416],
      },
      {
        redAlliance: [7039, 1577, 9740],
        blueAlliance: [1954, 4661, 3075],
      },
      {
        redAlliance: [2096, 5614, 2679],
        blueAlliance: [3211, 2231, 10139],
      },
      {
        redAlliance: [NaN, 7067, 6104],
        blueAlliance: [3065, 3316, NaN],
      },
      {
        redAlliance: [9990, 8175, 9739],
        blueAlliance: [3835, 2230, 2630],
      },
      {
        redAlliance: [7845, 4586, 5135],
        blueAlliance: [1937, 6738, 1690],
      },
      {
        redAlliance: [1574, 7112, 5715],
        blueAlliance: [5990, 1942, 4744],
      },
      {
        redAlliance: [7039, 3835, 1690],
        blueAlliance: [4586, 5928, 9740],
      },
      {
        redAlliance: [9990, 5654, 5715],
        blueAlliance: [3339, 2231, 1943],
      },
      {
        redAlliance: [2679, 6738, 5951],
        blueAlliance: [3075, 1577, 3065],
      },
      {
        redAlliance: [8175, 4590, 5135],
        blueAlliance: [3083, 9991, 5614],
      },
      {
        redAlliance: [5990, 7845, 9739],
        blueAlliance: [9738, 7067, 4744],
      },
      {
        redAlliance: [2230, 3316, 6104],
        blueAlliance: [1954, 4416, 1942],
      },
      {
        redAlliance: [2096, 1937, 4661],
        blueAlliance: [7112, 2630, 10139],
      },
      {
        redAlliance: [3211, 1574, 3065],
        blueAlliance: [8223, 6738, 2231],
      },
      {
        redAlliance: [8175, 9740, 1690],
        blueAlliance: [9990, 3083, 5951],
      },
      {
        redAlliance: [2679, 3075, 4590],
        blueAlliance: [4744, 5715, 4586],
      },
      {
        redAlliance: [1943, 3316, 9991],
        blueAlliance: [2230, 3339, 7039],
      },
      {
        redAlliance: [7067, 1577, 1954],
        blueAlliance: [5614, 2096, 9738],
      },
      {
        redAlliance: [4416, 8223, 3835],
        blueAlliance: [5654, 5135, 10139],
      },
      {
        redAlliance: [4661, 2630, 5928],
        blueAlliance: [1942, 7845, 3211],
      },
      {
        redAlliance: [6104, 1574, 9739],
        blueAlliance: [7112, 5990, 1937],
      },
      {
        redAlliance: [1943, 4586, 3083],
        blueAlliance: [3065, 2679, 3316],
      },
      {
        redAlliance: [4744, 9990, 3075],
        blueAlliance: [9991, 7039, 2096],
      },
      {
        redAlliance: [5715, 5614, 2231],
        blueAlliance: [1690, 5951, 4416],
      },
      {
        redAlliance: [1577, 9738, 3835],
        blueAlliance: [3211, 2230, 4590],
      },
      {
        redAlliance: [6738, 7112, 1954],
        blueAlliance: [10139, 8223, 5990],
      },
      {
        redAlliance: [1942, 5928, 5135],
        blueAlliance: [1937, 1574, 8175],
      },
      {
        redAlliance: [2630, 3339, 9740],
        blueAlliance: [7067, 6104, 7845],
      },
      {
        redAlliance: [5614, 5654, 4661],
        blueAlliance: [4586, 9739, 7039],
      },
      {
        redAlliance: [3835, 3211, 2096],
        blueAlliance: [2231, 4744, 3316],
      },
      {
        redAlliance: [10139, 4416, 3083],
        blueAlliance: [4590, 5990, 1577],
      },
      {
        redAlliance: [9738, 5951, 1937],
        blueAlliance: [9990, 1943, 8223],
      },
      {
        redAlliance: [9991, 7845, 3339],
        blueAlliance: [1954, 2679, 1574],
      },
      {
        redAlliance: [1942, 3065, 7112],
        blueAlliance: [5715, 9740, 7067],
      },
      {
        redAlliance: [8175, 2230, 6738],
        blueAlliance: [1690, 4661, 9739],
      },
      {
        redAlliance: [2630, 5135, 6104],
        blueAlliance: [5928, 3075, 5654],
      },
      {
        redAlliance: [7039, 3083, 4744],
        blueAlliance: [1937, 1577, 4416],
      },
      {
        redAlliance: [4586, 3211, 2231],
        blueAlliance: [5990, 1943, 1574],
      },
      {
        redAlliance: [3835, 7112, 9990],
        blueAlliance: [7845, 5715, 1954],
      },
      {
        redAlliance: [9740, 4661, 2230],
        blueAlliance: [8223, 8175, 2679],
      },
      {
        redAlliance: [6104, 5614, 1690],
        blueAlliance: [2630, 9738, 9991],
      },
      {
        redAlliance: [10139, 1942, 3339],
        blueAlliance: [3075, 9739, 5951],
      },
      {
        redAlliance: [3316, 5654, 7067],
        blueAlliance: [5928, 4590, 6738],
      },
      {
        redAlliance: [5135, 2096, 7845],
        blueAlliance: [3065, 7039, 1943],
      },
      {
        redAlliance: [7112, 4744, 2679],
        blueAlliance: [4416, 3211, 9990],
      },
      {
        redAlliance: [1577, 2231, 2630],
        blueAlliance: [1954, 6104, 8175],
      },
      {
        redAlliance: [9740, 10139, 3075],
        blueAlliance: [1574, 2230, 5614],
      },
      {
        redAlliance: [3083, 1942, 9738],
        blueAlliance: [5654, 3835, 6738],
      },
      {
        redAlliance: [2096, 5951, 3316],
        blueAlliance: [4661, 9991, 5990],
      },
      {
        redAlliance: [5715, 9739, 5928],
        blueAlliance: [5135, 4586, 8223],
      },
      {
        redAlliance: [1937, 1690, 4590],
        blueAlliance: [3065, 7067, 3339],
      },
      {
        redAlliance: [1943, 3075, 3211],
        blueAlliance: [5614, 8175, 4416],
      },
      {
        redAlliance: [2679, 7039, 1577],
        blueAlliance: [2231, 3835, 1574],
      },
      {
        redAlliance: [2096, 5990, 4744],
        blueAlliance: [5654, 9740, 1942],
      },
      {
        redAlliance: [6738, 4586, 2630],
        blueAlliance: [2230, 9990, 5135],
      },
      {
        redAlliance: [3065, 5928, 9738],
        blueAlliance: [4661, 3339, 7112],
      },
      {
        redAlliance: [5951, 6104, 8223],
        blueAlliance: [4590, 3083, 7845],
      },
      {
        redAlliance: [3316, 10139, 5715],
        blueAlliance: [7067, 9991, 1937],
      },
      {
        redAlliance: [4744, 1690, 1943],
        blueAlliance: [9739, 1954, 3835],
      },
      {
        redAlliance: [4416, 2679, 4586],
        blueAlliance: [6738, 2096, 1942],
      },
      {
        redAlliance: [5990, 5614, 3065],
        blueAlliance: [3339, 9990, 5928],
      },
      {
        redAlliance: [1574, 7112, 3083],
        blueAlliance: [5951, 2630, 2230],
      },
      {
        redAlliance: [7039, 5715, 8175],
        blueAlliance: [9738, 10139, 6104],
      },
      {
        redAlliance: [4590, 2231, 7067],
        blueAlliance: [5135, 4661, 3075],
      },
      {
        redAlliance: [7845, 8223, 5654],
        blueAlliance: [3316, 1690, 1577],
      },
      {
        redAlliance: [9991, 1954, 9740],
        blueAlliance: [9739, 1937, 3211],
      },
      {
        redAlliance: [3083, 3065, 2230],
        blueAlliance: [5928, 4744, 5614],
      },
      {
        redAlliance: [3339, 4416, 5990],
        blueAlliance: [3835, 8175, 2630],
      },
      {
        redAlliance: [1574, 9990, 2096],
        blueAlliance: [6104, 4590, 4661],
      },
      {
        redAlliance: [8223, 7067, 7039],
        blueAlliance: [1690, 1942, 2679],
      },
      {
        redAlliance: [3211, 1954, 5654],
        blueAlliance: [5951, 5135, 5715],
      },
      {
        redAlliance: [2231, 1937, 10139],
        blueAlliance: [7845, 9738, 4586],
      },
      {
        redAlliance: [1577, 6738, 9991],
        blueAlliance: [9740, 1943, 7112],
      },
      {
        redAlliance: [9739, 3065, 9990],
        blueAlliance: [3075, 3316, 3083],
      },
    ];
    if (matchesStorage.exists()) {
      return matchesStorage.get();
    }
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

    matchesStorage.set(qualificationResults);
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

export async function postNotes(notes: QualNotes, user: string) {
  return await fetchData(`team_notes`, "POST", JSON.stringify({ notes, user }));
}

export async function fetchNotes(teamNumber?: number): Promise<QualNotes> {
  return teamNumber
    ? await fetchData(`team_notes/team/${teamNumber}`)
    : await fetchData(`team_notes/all`);
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
