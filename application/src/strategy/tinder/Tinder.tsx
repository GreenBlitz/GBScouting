import { useEffect, useState } from "react";
import { GridItems, processTeamData } from "../general-tab/GeneralTab";
import { useRecent, mergeSimilarMatches } from "../../components/TeamPicker";
import { TeamData } from "../../TeamData";
import { fetchTeams } from "../../utils/Fetches";
import { FRCTeamList } from "../../utils/Utils";
import TeamCard from "./TeamCard";

const defaultSort = (team1: GridItems, team2: GridItems): number => {
  return team2.Points - team1.Points;
}; // sorts from best to worst points

const Tinder: React.FC = () => {
  const [ranking, setRanking] = useState<GridItems[]>([]);
  const [recency, setRecency] = useState<number>(5);

  useEffect(() => {
    fetchTeams(Object.keys(FRCTeamList).map((key) => parseInt(key)))
      .then((teams) =>
        Object.entries(teams).map(([team, matches]) =>
          processTeamData(
            parseInt(team),
            new TeamData(useRecent(mergeSimilarMatches(matches), recency))
          )
        )
      )
      .then((data) => data.sort(defaultSort))
      .then(setRanking);
  }, [recency]);

  return (
    <div>
      {/* <div className="float-left ml-10">
        {ranking.map((item) => (
          <h2>{item.Team}</h2>
        ))}
      </div> */}
      <div className="flex flex-row">
        <TeamCard stats={ranking[0] || {}} />
        <TeamCard stats={ranking[1] || {}} />
      </div>
    </div>
  );
};

export default Tinder;
