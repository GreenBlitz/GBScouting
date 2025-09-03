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
  const [currentID, setID] = useState(0);

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

  const choose = (index: number) => {
    if (index !== currentID) {
      const temp = ranking[currentID];
      ranking[currentID] = ranking[currentID + 1];
      ranking[currentID + 1] = temp;
    }

    setID((prevID) => prevID + 1);
  };

  console.log(ranking);

  return (
    <div>
      {/* <div className="float-left ml-10">
        {ranking.map((item) => (
          <h2>{item.Team}</h2>
        ))}
      </div> */}
      <div className="flex flex-row">
        <TeamCard
          stats={ranking[currentID] || {}}
          onSwipe={() => choose(currentID)}
        />
        <TeamCard
          stats={ranking[currentID + 1] || {}}
          onSwipe={() => choose(currentID + 1)}
        />
      </div>
    </div>
  );
};

export default Tinder;
