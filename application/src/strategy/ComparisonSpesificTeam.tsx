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
      <div className="section">
        <RadarComponent
          inputs={[
            {
              value: teamData.getAverage(matchFieldNames.teleReefPick, [
                "levels",
                "L4",
                "score",
              ]),
              max: getMax("L4"),
              name: "L4",
            },

            {
              value: teamData.getAverage(matchFieldNames.teleReefPick, [
                "levels",
                "L3",
                "score",
              ]),
              max: getMax("L3"),
              name: "L3",
            },

            {
              value: teamData.getAverage(matchFieldNames.teleReefPick, [
                "levels",
                "L2",
                "score",
              ]),
              max: getMax("L2"),
              name: "L2",
            },
            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
              max: getMax("Net"),
              name: "Net",
            },
            {
              value: evasion,
              max: getMax("Evasion"),
              name: "Evasion",
            },

            {
              value: teamData.getAverageAutoScore(),
              max: getMax("Auto"),
              name: "Auto",
            },
          ]}
          size={300}
          substeps={5}
        />
      </div>

      <div className="section">
        <RadarComponent
          inputs={[
            {
              value: teamData.getAverage(matchFieldNames.teleReefPick, [
                "levels",
                "L1",
                "score",
              ]),
              max: getMax("L1"),
              name: "L1",
            },
            {
              value: defense !== 0 ? 6 - defense : 0,
              max: getMax("Defense"),
              name: "Defense",
            },

            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
              max: getMax("Net"),
              name: "Net",
            },
            {
              value: teamData.getAverageAutoScore(),
              max: getMax("Auto"),
              name: "Auto",
            },
            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "processor"
              ),

              max: getMax("Processor"),
              name: "Processor",
            },
          ]}
          size={300}
          substeps={5}
        />
      </div>
      <br />
      <h1 className="text-2xl">Average Score: {teamData.getAverageScore()}</h1>
      <h1 className="text-2xl">
        Average Auto Score: {teamData.getAverageAutoScore()}
      </h1>
      <div className="h-20" />
      <div className="rower">
        <CollectionChart collection={teamData.getCollections()} />
      </div>
      <div className="section">
        <Outlet context={{ teamData }} />
      </div>
      <div className="h-20" />
      <div className="mb-10">
        <h1 className="text-xl mb-5">Overall</h1>
        <div className="section">
          <LineChart
            dataSets={{
              "Total Score": { color: "red", data: teamData.getScores() },
            }}
          />
        </div>
        <div className="section">
          <LineChart
            dataSets={{
              Objects: {
                color: "cyan",
                data: teamData.getTeleopObjectsAsLine(),
              },
            }}
          />
        </div>
      </div>

      <br />
      <div className="mb-10">
        <h1 className="text-xl mb-5">Coral + Algae</h1>
        <div className="section">
          <LineChart
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
          <LineChart
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
      <div className="mb-10">
        <h1 className="text-xl mb-5">Defense</h1>
        <div className="section">
          <LineChart
            dataSets={{
              Defense: {
                color: "purple",
                data: teamData.getAsLine(matchFieldNames.defense),
              },

              Evasion: {
                color: "pink",
                data: teamData.getAsLine(matchFieldNames.defensiveEvasion),
              },
            }}
          />
        </div>
      </div>

      <div className="h-32" />
      <div>
        <h1>Comments</h1>
        {teamData?.getComments().map((comment) => (
          <h3 style={{ border: "solid" }}>
            {"Qual #" + comment.qual + ": " + comment.body}
          </h3>
        ))}
      </div>
      <div className="h-48" />

      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Total Corals</h1>
        <CoralChart corals={teamData.getTeleopCorals()} />
      </div>
    </>
  );
};

export default ComparisonSpesificTeams;
