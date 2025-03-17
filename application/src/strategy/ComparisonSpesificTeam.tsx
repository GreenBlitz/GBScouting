import React, { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { TeamData } from "../TeamData";
import { GridItems } from "./general-tab/GeneralTab";
import { matchFieldNames } from "../utils/Match";
import RadarComponent from "./charts/RadarChart";
import CollectionChart from "./charts/CollectionChart";
import LineChart from "./charts/LineChart";
import CoralChart from "./charts/CoralChart";
import BarChart from "./charts/BarChart"

export const reefColorsScore = {
  L1: "#e5ffc9",
  L2: "#a1d994",
  L3: "#5eb25e",
  L4: "#1a8c29",
};

export const reefColorsMiss = {
  L1: "#ffb78e",
  L2: "#f58a6b",
  L3: "#eb5e48",
  L4: "#e13125",
};

const climbColorMap = {
  Park: "#006989",
  "Off Barge": "#E94F37",
  "Shallow Cage": "#F9DC5C",
  "Deep Cage": "#44BBA4",
  "Tried Deep": "#ED7117",
};

type ClimbKeys = keyof typeof climbColorMap;

const ComparisonSpesificTeams: React.FC = () => {
  const { teamData, teamTable } = useOutletContext<{
    teamData: TeamData;
    teamTable: GridItems[];
  }>();

  const navigate = useNavigate();

  const evasion = useMemo(
    () => teamData.getAverage(matchFieldNames.defensiveEvasion),
    [teamData]
  );
  const defense = useMemo(
    () => teamData.getAverage(matchFieldNames.defense),
    [teamData]
  );

  const getMax = (field: keyof GridItems) => {
    return teamTable.reduce(
      (accumulator, team) => Math.max(accumulator, team[field]),
      0
    );
  };

  const location = useLocation();
  useEffect(() => {
    const isAlready = location.pathname.includes("linear");
    if (teamData.matches.length === 0) {
      navigate("/strategy/team/teleoperated");
    } else if (!isAlready) {
      navigate("/strategy/team/teleoperated/linear");
    } else {
      navigate("/strategy/team/teleoperated/histogram");
    }
  }, [teamData]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-xl mb-5">Coral + Algae</h1>
        <div className="section">
          <BarChart 
              dataSets={{
              ...Object.fromEntries(
                Object.entries(reefColorsScore).map(([key, value]) => [
                  key,
              {
              color: value,
              data: teamData.getAsLine(matchFieldNames.teleReefPick, [
                "levels",
                key,
                "miss",
              ]),
            },
          ])
        ),
        NetScore: {
          color: "#172db8",
          data: teamData.getAlgeaDataAsLine(
            matchFieldNames.teleReefPick,
            "netScore"
          ),
        },
        Processor: {
          color: "#8fb4ff",
          data: teamData.getAlgeaDataAsLine(
            matchFieldNames.teleReefPick,
            "processor"
          ),
        },
      }}
      />
        </div>

        <div className="section">
          <BarChart
             dataSets={{
            ...Object.fromEntries(
              Object.entries(reefColorsMiss).map(([key, value]) => [
                key,
            {
            color: value,
            data: teamData.getAsLine(matchFieldNames.teleReefPick, [
              "levels",
              key,
              "miss",
            ]),
          },
        ])
      ),
      NetMiss: {
        color: "#b81616",
        data: teamData.getAlgeaDataAsLine(
          matchFieldNames.teleReefPick,
          "netMiss"
        ),
      },
    }}
  />

        </div>
      </div>
      <br />
    </>
  );
};

export default ComparisonSpesificTeams;
