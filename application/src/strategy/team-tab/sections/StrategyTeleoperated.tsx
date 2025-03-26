import React, { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { TeamData } from "../../../TeamData";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";
import { matchFieldNames } from "../../../utils/Match";
import RadarComponent from "../../charts/RadarChart";
import CollectionChart from "../../charts/CollectionChart";
import { GridItems } from "../../general-tab/GeneralTab";
import BarChart from "../../charts/BarChart";
import { localFolder, StorageBacked } from "../../../utils/FolderStorage";
import Collapsible from "react-collapsible";

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

export const isLineChartStorage = new StorageBacked<boolean>(
  "strategy/isBarChart",
  localFolder
);

const StrategyTeleoperated: React.FC = () => {
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

  const scoringDataSet = useMemo(() => {
    return {
      ...Object.fromEntries(
        Object.entries(reefColorsScore).map(([key, value]) => [
          key,
          {
            color: value,
            data: teamData.getAsLine(matchFieldNames.teleReefPick, [
              "levels",
              key,
              "score",
            ]),
          },
        ])
      ),
      Net: {
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
    };
  }, [teamData]);

  const missDataSet = useMemo(() => {
    return {
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
      Net: {
        color: "#b81616",
        data: teamData.getAlgeaDataAsLine(
          matchFieldNames.teleReefPick,
          "netMiss"
        ),
      },
    };
  }, [teamData]);

  const [isLineChart, setIsLineChart] = useState(isLineChartStorage.get());

  return (
    <>
      <div className="mb-10">
        <div className="section">
          {isLineChart ? (
            <LineChart dataSets={scoringDataSet} />
          ) : (
            <BarChart dataSets={scoringDataSet} isStacked={true} />
          )}
        </div>

        <div className="section">
          {isLineChart ? (
            <LineChart dataSets={missDataSet} />
          ) : (
            <BarChart dataSets={missDataSet} isStacked={true} />
          )}
        </div>

        <button
          className="big-button button-green mx-auto h-9"
          onClick={() => {
            isLineChartStorage.set(!isLineChartStorage.get());
            setIsLineChart(!isLineChart);
          }}
        >
          Switch
        </button>
      </div>

      {teamData.notes.length > 0 && (
        <Collapsible
          trigger="Super Scouting"
          openedClassName="border-2 py-2"
          className="border-2 py-2"
        >
          {teamData.notes.map((notes) => (
            <div className="my-5">
              <h1 className="text-xl">Qual {notes.qual}</h1>
              {notes.body.climb !== "" && (
                <h2 className="my-1">Climb: {notes.body.climb}</h2>
              )}
              {notes.body.net !== "" && (
                <h2 className="my-1">Algae: {notes.body.net}</h2>
              )}
              {notes.body.defense !== "" && (
                <h2 className="my-1">Defense: {notes.body.defense}</h2>
              )}
              {notes.body.evasion !== "" && (
                <h2 className="my-1">Evasion: {notes.body.evasion}</h2>
              )}
              {notes.body.driving !== "" && (
                <h2 className="my-1">Driving: {notes.body.driving}</h2>
              )}
              {notes.body.coral !== "" && (
                <h2 className="my-1">Coral: {notes.body.coral}</h2>
              )}
              {notes.body.overall !== "" && (
                <h2 className="my-1">Overall: {notes.body.overall}</h2>
              )}
            </div>
          ))}
        </Collapsible>
      )}

      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Total Corals</h1>
        <CoralChart corals={teamData.getTeleopCorals()} />
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
      <div>
        <h1>Comments</h1>
        {teamData?.getComments().map((comment) => (
          <h3 style={{ border: "solid" }}>
            {"Qual #" + comment.qual + ": " + comment.body}
          </h3>
        ))}
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
    </>
  );
};

export default StrategyTeleoperated;
