import React, { useEffect, useState } from "react";
import { Match, mergeMatches } from "../utils/Match";
import { FRCTeamList, sortMatches } from "../utils/Utils";
import { fetchMatchesByCriteria, fetchNotes } from "../utils/Fetches";
import { matchFieldNames } from "../utils/Match";
import { TeamData } from "../TeamData";

interface TeamPickerProps {
  setTeamData: (teamData: TeamData) => void;
  defaultRecency: number;
}

export function mergeSimilarMatches(matches: Match[]) {
  const sortedOnes = {};
  matches.forEach((match) => {
    if (sortedOnes[match.qual.toString() + match.teamNumber.teamNumber]) {
      sortedOnes[match.qual.toString() + match.teamNumber.teamNumber].push(
        match
      );
      return;
    }
    sortedOnes[match.qual.toString() + match.teamNumber.teamNumber] = [match];
  });

  return Object.values(sortedOnes).map((matches) =>
    mergeMatches(matches as Match[])
  );
}

export function useRecent(matches: Match[], recency: number): Match[] {
  const recentMatches = mergeSimilarMatches(sortMatches([...matches]));

  if (recency > 0 && recency < recentMatches.length) {
    recentMatches.splice(0, recentMatches.length - recency);
  }
  return recentMatches;
}

const TeamPicker: React.FC<TeamPickerProps> = ({
  setTeamData,
  defaultRecency,
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recency, setRecency] = useState<number>(defaultRecency);

  const getNotes = async (matches: Match[]) => {
    if (!matches[0]) {
      return undefined;
    }
    return await fetchNotes(matches[0].teamNumber.teamNumber);
  };

  useEffect(() => {
    const recentMatches = useRecent(matches, recency);
    async function updateTeamData() {
      setTeamData(new TeamData(recentMatches, await getNotes(recentMatches)));
    }
    updateTeamData();
  }, [matches, recency]);

  return (
    <div className="team-picker">
      <label htmlFor="team number">Team</label>

      <select
        id="team number"
        name="team number"
        onChange={async (event) =>
          setMatches(
            await fetchMatchesByCriteria(
              matchFieldNames.teamNumber,
              event.target.value.slice(0, 4) || "0"
            )
          )
        }
      >
        {Object.entries(FRCTeamList).map(([teamNumber, teamName], index) => {
          const item = `${teamNumber} ${teamName}`;
          return (
            <option value={item} key={index}>
              {item}
            </option>
          );
        })}
      </select>
      <label htmlFor="recency">Recency</label>
      <input
        type="number"
        id="recency"
        name="recency"
        onChange={(event) => setRecency(parseInt(event.target.value))}
        min={1}
        max={matches.length}
        defaultValue={defaultRecency}
      />
    </div>
  );
};

export default TeamPicker;
