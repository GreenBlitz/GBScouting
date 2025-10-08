import { GridItems } from "../general-tab/GeneralTab";
import { FRCTeamList } from "../../utils/Utils";
import LineChart from "../charts/LineChart";
import { TeamInfo } from "./Tinder";
import { reefColorsScore } from "../team-tab/sections/StrategyTeleoperated";
import { matchFieldNames } from "../../utils/Match";
import { Levels } from "../../scouter/input-types/reef-levels/ReefPickInput";
import React, { useMemo, useState } from "react";
import { Mode, TeamCard as QualTeamCard } from "../qual-tab/QualTab";

interface TeamCardProps {
  teamInfo: TeamInfo;
  onSwipe: () => void;
  mode: Mode;
  max: number;
}

const roundToDecimals = (x: number, decimals: number = 0) => {
  const powered = Math.pow(10, decimals);
  return Math.round(x * powered) / powered;
};

const TeamCard: React.FC<TeamCardProps> = ({
  teamInfo,
  onSwipe,
  mode,
  max,
}) => {
  const [isNotes, setNotes] = useState(false);

  return (
    <div className="mx-auto p-5 mt-10 rounded-xl bg-green-800 w-96">
      <div className="flex justify-center">
        <QualTeamCard
          side={"green" as "blue"}
          teamInfo={teamInfo}
          mode={mode}
          max={max}
        />
      </div>

      <button className="p-4 bg-green-950" onClick={onSwipe}>
        Choose
      </button>
    </div>
  );
};

export default TeamCard;
