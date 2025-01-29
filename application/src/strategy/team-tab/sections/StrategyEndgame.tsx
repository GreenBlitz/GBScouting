import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import LinearHistogramChart from "../../charts/LinearHistogramChart";
import PieChart from "../../charts/PieChart";
import { matchFieldNames } from "../../../utils/Match";

const climbColorMap = {
  Park: "#006989",
  "Off Barge": "#E94F37",
  "Shallow Cage": "#F9DC5C",
  "Deep Cage": "#44BBA4",
};
type ClimbKeys = keyof typeof climbColorMap;

const StrategyEndgame: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();

  return (
    <>
      <div className="section">
        <LinearHistogramChart
          height={200}
          width={400}
          sectionColors={climbColorMap}
          sections={teamData?.getAsLinearHistogram<ClimbKeys>(matchFieldNames.climb) || []}
        />
      </div>

      <div className="section">
        <PieChart pieData={teamData?.getAsPie(matchFieldNames.climb, climbColorMap) || {}} />
      </div>

      <div>
        <h1>Comments</h1>
        {teamData?.getComments().map((comment) => (
          <h3 style={{ border: "solid" }}>
            {"Qual #" + comment.qual + ": " + comment.body}
          </h3>
        ))}
      </div>
    </>
  );
};

export default StrategyEndgame;
