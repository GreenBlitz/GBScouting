import React, { useEffect, useMemo, useState } from "react";
import { StorageBacked, useStorage } from "../utils/FolderStorage";
import {
  DCMPMatches,
  HashedQualTeam,
  noteCategories,
  Notes,
  QualNotes,
} from "../utils/SeasonUI";
import { FRCTeamList } from "../utils/Utils";
import { postNotes } from "../utils/Fetches";

export const defaultNotes: Notes = noteCategories.reduce((acc, value) => {
  acc[value] = { value: "", score: 0 };
  return acc;
}, {}) as Notes;

const ScoreScale: React.FC<{
  category: keyof Notes;
  currentScore: number;
  handleScoreChange: (category: keyof Notes, score: number) => void;
}> = ({ category, currentScore, handleScoreChange }) => (
  <div className="flex items-center space-x-2">
    <span className="text-xs text-gray-500">Score:</span>
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5, 6, 7].map((score) => (
        <button
          key={score}
          onClick={() => handleScoreChange(category, score)}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
            currentScore === score
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow-sm"
          }`}
        >
          {score}
        </button>
      ))}
    </div>
  </div>
);

const hashTeamQual = (team: number, qual: number): HashedQualTeam =>
  `frc${team} qual${qual}`;

const TeamElement: React.FC<{
  team: number;
  currentTeamNotes: Notes;
  setTeamNotes: (content: Notes) => void;
  isBlueAlliance: boolean;
}> = ({ team, currentTeamNotes, setTeamNotes, isBlueAlliance }) => {
  const teamNotes = currentTeamNotes || defaultNotes;

  const handleNoteChange = (category: keyof Notes, value: string) => {
    const currentScore = teamNotes[category]?.score || 0;
    const updatedNotes = {
      ...teamNotes,
      [category]: { value, score: currentScore },
    };
    setTeamNotes(updatedNotes);
  };

  const handleScoreChange = (category: keyof Notes, score: number) => {
    const currentValue = teamNotes[category]?.value || "";
    const updatedNotes = {
      ...teamNotes,
      [category]: { value: currentValue, score },
    };
    setTeamNotes(updatedNotes);
  };

  const teamName = FRCTeamList[team] || "Unknown Team";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Team {team}</h3>
          <p className="text-sm text-gray-600 font-medium">{teamName}</p>
        </div>
        <div
          className={`w-3 h-3 bg-${
            isBlueAlliance ? "blue" : "red"
          }-500 rounded-full`}
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {noteCategories.map((category) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`${team}-${category}`}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {category}
              </label>
              <ScoreScale
                category={category}
                currentScore={teamNotes[category]?.score || 0}
                handleScoreChange={handleScoreChange}
              />
            </div>
            <textarea
              id={`${team}-${category}`}
              value={teamNotes[category]?.value || ""}
              onChange={(e) => handleNoteChange(category, e.target.value)}
              placeholder={`Enter ${category} notes...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors duration-200"
              rows={3}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Total characters:{" "}
            {Object.values(teamNotes).reduce(
              (total, note) => total + (note?.value?.length || 0),
              0
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const NoteTab: React.FC = () => {
  const [notes, setNotes] = useStorage<QualNotes>(
    new StorageBacked("teamNotes", localStorage),
    {}
  );

  const [user, _setUser] = useStorage<string>(
    new StorageBacked("user", localStorage),
    Math.random().toString(36).substring(2, 10)
  );

  const [qual, setQual] = useState(1);
  const [isBlueSide, setSide] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const teams = useMemo(
    () =>
      isBlueSide
        ? DCMPMatches[qual].blueAlliance
        : DCMPMatches[qual].redAlliance,
    [isBlueSide, qual]
  );

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    await postNotes(notes, user);
    setIsSaving(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleSaveToDatabase();
      console.log("Auto-saved notes to database");
    }, 60 * 1000); // Save every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-100">Team Notes</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">
                  Qualifier:
                </span>
                <select
                  value={qual}
                  onChange={(e) => setQual(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DCMPMatches.map((_, index) => (
                    <option key={index} value={index + 1}>
                      Qual {index + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveToDatabase}
                  disabled={isSaving}
                  className={`ml-2 px-3 py-1 rounded-md font-medium transition-colors duration-200 ${
                    isSaving
                      ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
              <button
                onClick={() => setSide((prev) => !prev)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  isBlueSide
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isBlueSide ? "Blue Alliance" : "Red Alliance"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isBlueSide ? "bg-blue-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {isBlueSide ? "Blue Alliance" : "Red Alliance"} - Qual{" "}
                    {qual}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Teams:{" "}
                  {teams
                    .map((team) => `${team} ${FRCTeamList[team] || ""}`)
                    .join(", ")}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {teams.length} teams
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {teams.map((team) => (
            <TeamElement
              key={team}
              team={team}
              setTeamNotes={(teamNotes) => {
                const updatedNotes = {
                  ...notes,
                  [hashTeamQual(team, qual)]: teamNotes,
                };
                setNotes(updatedNotes);
              }}
              currentTeamNotes={notes[hashTeamQual(team, qual)] || defaultNotes}
              isBlueAlliance={isBlueSide}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteTab;
