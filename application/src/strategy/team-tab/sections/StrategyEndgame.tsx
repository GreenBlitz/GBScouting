import React from "react";
import { useLocation } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import LinearHistogramChart from "../../charts/LinearHistogramChart";
import PieChart from "../../charts/PieChart";

const climbColorMap = {
  Park: "#006989",
  "Off Barge": "#E94F37",
  "Shallow Cage": "#F9DC5C",
  "Deep Cage": "#44BBA4",
};
type ClimbKeys = keyof typeof climbColorMap;

const exampleTeamData: TeamData = new TeamData([
  {
    scouterName: "",
    qual: 0,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    climb: "Off Barge",
    comment: "",
    reefForm: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
    },
  },
  {
    scouterName: "",
    qual: 0,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    climb: "Off Barge",
    comment: "",
    reefForm: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
    },
  },
  {
    scouterName: "",
    qual: 0,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    climb: "Park",
    comment: "",
    reefForm: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
    },
  },
  {
    scouterName: "",
    qual: 0,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    climb: "Off Barge",
    comment: "",
    reefForm: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
    },
  },
]);

const StrategyEndgame: React.FC = () => {
  const location = useLocation();
  // const teamData: TeamData | undefined = location.state;
  const teamData = exampleTeamData;
  if (!teamData) {
    return <></>;
  }
  return (
    <>
      <LinearHistogramChart
        height={40}
        width={400}
        sectionColors={climbColorMap}
        sections={teamData.getAsLinearHistogram<ClimbKeys>("climb") || []}
      />

      <PieChart pieData={teamData.getAsPie("climb", climbColorMap) || {}} />
    </>
  );
};

export default StrategyEndgame;
