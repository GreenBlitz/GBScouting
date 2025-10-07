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
import NetChart from "../../charts/NetChart";
import { QualNotes, TeamNotes } from "../../../utils/SeasonUI";
import { compileNotes } from "../../tinder/InitialRanker";

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
  const { teamData, teamTable, notes } = useOutletContext<{
    teamData: TeamData;
    teamTable: GridItems[];
    notes: TeamNotes;
  }>();

  const compiledNotes = useMemo(() => compileNotes(notes), [notes]);

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
            <BarChart
              width={600}
              height={300}
              dataSets={scoringDataSet}
              isStacked={true}
            />
          )}
        </div>

        <div className="section">
          {isLineChart ? (
            <LineChart dataSets={missDataSet} />
          ) : (
            <BarChart
              width={600}
              height={300}
              dataSets={missDataSet}
              isStacked={true}
            />
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

      {Object.entries(compiledNotes).map(
        ([noteType, note]) =>
          note.score > 0 &&
          note.value.length > 0 && (
            <div className="rounded-2xl bg-white/5 p-1 shadow-md border border-white/10 hover:bg-white/10 transition">
              {note.score > 0 && (
                <h1 className="text-m font-semibold text-white mb-2">
                  {noteType}:{" "}
                  <span className="text-orange-400">{note.score}</span>
                </h1>
              )}
              {note.value.length > 0 && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {note.value}
                </p>
              )}
            </div>
          )
      )}

      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Total Corals</h1>
        <CoralChart corals={teamData.getTeleopCorals()} />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Net stats</h1>
        <NetChart algaes={teamData.getTeleopNet()} />
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
      <div className="section grid gap-3">
        {teamData.matches.map((match, index) => (
          <div
            key={index}
            className="bg-white/10 p-4 rounded-xl shadow-md hover:bg-white/20 transition"
          >
            <h2 className="text-lg font-semibold text-white">
              Qualifier: <span className="text-green-400">{match.qual}</span>
            </h2>
            <p className="text-gray-300 mt-1">
              Climb: <span className="text-blue-400">{match.climb}</span>
            </p>
          </div>
        ))}
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
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Comments</h1>
        <div className="space-y-3">
          {teamData?.getComments().map((comment, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-300 p-3 shadow-sm bg-white"
            >
              <p className="text-sm text-gray-500 font-medium">
                Qual #{comment.qual}
              </p>
              <p className="text-base text-gray-800">
                {comment.body.length > 1 && comment.body}
              </p>
            </div>
          ))}
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
