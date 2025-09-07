import React, { useEffect, useMemo, useState } from "react";
import { StorageBacked, useStorage } from "../utils/FolderStorage";
import { DCMPMatches, noteCategories, Notes } from "../utils/SeasonUI";

const defaultNotes: Notes = noteCategories.reduce((acc, value) => {
  acc[value] = "";
  return acc;
}, {}) as Notes;

const TeamElement: React.FC<{
  team: number;
  currentTeamNotes: Notes;
  setTeamNotes: (content: Notes) => void;
}> = ({ team, currentTeamNotes, setTeamNotes }) => {
  const teamNotes = currentTeamNotes || defaultNotes;

  const handleNoteChange = (category: keyof Notes, value: string) => {
    const updatedNotes = { ...teamNotes, [category]: value };
    setTeamNotes(updatedNotes);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Team {team}</h3>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {noteCategories.map((category) => (
          <div key={category} className="space-y-2">
            <label
              htmlFor={`${team}-${category}`}
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {category}
            </label>
            <textarea
              id={`${team}-${category}`}
              value={teamNotes[category] || ""}
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
            Total characters: {Object.values(teamNotes).join("").length}
          </span>
          <span className="text-green-600 font-medium">✓ Auto-saved</span>
        </div>
      </div>
    </div>
  );
};

const NoteTab: React.FC = () => {
  const [notes, setNotes] = useStorage<Record<number, Notes>>(
    new StorageBacked("teamNotes", localStorage),
    {}
  );

  const [qual, setQual] = useState(1);

  const [isBlueSide, setSide] = useState(true);

  const teams = useMemo(
    () =>
      isBlueSide
        ? DCMPMatches[qual].blueAlliance
        : DCMPMatches[qual].redAlliance,
    [isBlueSide, qual]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Team Notes</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Qualification:
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
                  Teams: {teams.join(", ")}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {teams.length} teams
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {teams.map((team) => (
            <TeamElement
              key={team}
              team={team}
              setTeamNotes={(teamNotes) => {
                const updatedNotes = { ...notes, [team]: teamNotes };
                setNotes(updatedNotes);
              }}
              currentTeamNotes={notes[team] || defaultNotes}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteTab;
