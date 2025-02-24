import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";
import { matchFieldNames } from "../../../utils/Match";
import RadarComponent from "../../charts/RadarChart";
import CollectionChart from "../../charts/CollectionChart";
import LinearHistogramChart from "../../charts/LinearHistogramChart";

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
};

type ClimbKeys = keyof typeof climbColorMap;

const StrategyTeleoperated: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  const evasion = useMemo(
    () => teamData.getAverage(matchFieldNames.defensiveEvasion),
    [teamData]
  );
  const defense = useMemo(
    () => teamData.getAverage(matchFieldNames.defense),
    [teamData]
  );

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
              max: 6,
              name: "L4",
            },

            {
              value: teamData.getAverage(matchFieldNames.teleReefPick, [
                "levels",
                "L3",
                "score",
              ]),
              max: 6,
              name: "L3",
            },

            {
              value: teamData.getAverage(matchFieldNames.teleReefPick, [
                "levels",
                "L2",
                "score",
              ]),
              max: 6,
              name: "L2",
            },
            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
              max: 10,
              name: "Net",
            },
            {
              value: evasion,
              max: 5,
              name: "Evasion",
            },

            { value: teamData.getAverageAutoScore(), max: 30, name: "Auto" },
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
              max: 8,
              name: "L1",
            },
            {
              value: defense !== 0 ? 6 - defense : 0,
              max: 5,
              name: "Defense",
            },

            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
              max: 18,
              name: "Net",
            },
            { value: teamData.getAverageAutoScore(), max: 50, name: "Auto" },
            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "processor"
              ),

              max: 12,
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
        <LinearHistogramChart
          height={200}
          width={400}
          sectionColors={climbColorMap}
          sections={
            teamData?.getAsLinearHistogram<ClimbKeys>(matchFieldNames.climb) ||
            []
          }
        />
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
        <h1 className="text-xl mb-5">Coral</h1>
        <div className="section">
          <LineChart
            dataSets={Object.assign(
              {},
              ...Object.entries(reefColorsScore).map(([key, value]) => {
                return {
                  [key]: {
                    color: value,
                    data: teamData.getAsLine(matchFieldNames.teleReefPick, [
                      "levels",
                      key,
                      "score",
                    ]),
                  },
                };
              })
            )}
          />
        </div>

        <div className="section">
          <LineChart
            dataSets={Object.assign(
              {},
              ...Object.entries(reefColorsMiss).map(([key, value]) => {
                return {
                  [key]: {
                    color: value,
                    data: teamData.getAsLine(matchFieldNames.teleReefPick, [
                      "levels",
                      key,
                      "miss",
                    ]),
                  },
                };
              })
            )}
          />
        </div>
      </div>
      <br />
      <div className="mb-10">
        <h1 className="text-xl mb-5">Algea + Defense</h1>
        <div className="section">
          <LineChart
            dataSets={{
              Score: {
                color: "green",
                data: teamData.getAlgeaDataAsLine(
                  matchFieldNames.teleReefPick,
                  "netScore"
                ),
              },
              Miss: {
                color: "red",
                data: teamData.getAlgeaDataAsLine(
                  matchFieldNames.teleReefPick,
                  "netMiss"
                ),
              },
              Processor: {
                color: "yellow",
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

export default StrategyTeleoperated;
