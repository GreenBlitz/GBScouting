import { useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import React from "react";
import { matchFieldNames } from "../../../utils/Match";
import LinearHistogramChart from "../../charts/LinearHistogramChart";
const climbColorMap = {
  Park: "#006989",
  "Off Barge": "#E94F37",
  "Shallow Cage": "#F9DC5C",
  "Deep Cage": "#44BBA4",
  "Tried Deep": "#ED7117",
};

type ClimbKeys = keyof typeof climbColorMap;
const TestLinear2: React.FC = () => {
  const { teamData } = useOutletContext<{
    teamData: TeamData;
  }>();

  return (
    <LinearHistogramChart
      height={200}
      width={400}
      sectionColors={climbColorMap}
      sections={
        teamData?.getAsLinearHistogram<ClimbKeys>(matchFieldNames.climb) || []
      }
    />
  );
};

export default TestLinear2;
