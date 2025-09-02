import { GridItems } from "../general-tab/GeneralTab";
import { FRCTeamList } from "../../utils/Utils";

interface TeamCardProps {
  stats: GridItems;
}

const TeamCard: React.FC<TeamCardProps> = ({ stats }) => {
  return (
    <div className="mx-auto mt-10">
      <h1 className="font-bold text-2xl">{FRCTeamList[stats.Team]}</h1>
      <h2 className="font-semibold text-xl">{stats.Team}</h2>
      
    </div>
  );
};

export default TeamCard;
