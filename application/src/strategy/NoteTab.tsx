import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAllAwaitingMatches,
  MatchTeams,
  postNotes,
} from "../utils/Fetches";
import { StorageBacked } from "../utils/FolderStorage";
import { Notes } from "../utils/SeasonUI";

const defaultNotes: Notes = {
  defense: "",
  evasion: "",
  net: "",
  coral: "",
  climb: "",
  faults: "",
};

const TeamElement: React.FC<{
  team: number;
  currentTeamNotes: Notes;
  setTeamNotes: (content: Notes) => void;
}> = ({ team, currentTeamNotes, setTeamNotes }) => (
  <div className="mx-2 my-5">
    <h1 className="text-2xl">{team}</h1>
    <div className="rower">
      {Object.keys(defaultNotes).map((noteType) => (
        <div key={noteType}>
          <h2 className="text-xl">{noteType}</h2>
          <input
            type="text"
            ref={(input) => {
              if (input) input.value = currentTeamNotes[noteType] || "";
            }}
            className="bg-dark-card"
            onChange={(event) =>
              setTeamNotes({
                ...currentTeamNotes,
                [noteType]: event.currentTarget.value,
              })
            }
          />
        </div>
      ))}
    </div>
  </div>
);

const NoteTab: React.FC = () => {
  const allMatches = useMemo(
    () => new StorageBacked<MatchTeams[]>("notes/matches", localStorage),
    []
  );

  const [qual, setQual] = useState<number>(1);

  const [matchResults, setMatchResults] = useState<MatchTeams | null>(null);

  const [team, setTeam] = useState<number | null>(null);

  useEffect(() => {
    if (allMatches.exists()) {
      return;
    }
    async function updateMatchResults() {
      const matchResults = await fetchAllAwaitingMatches();
      if (matchResults) allMatches.set(matchResults);
    }
    updateMatchResults()
      .then(() => alert("Successfuly pulled matches."))
      .catch(() => alert("Could not pull matches"));
  }, []);

  useEffect(() => {
    const matches = allMatches.get();
    if (matches) setMatchResults(matches[qual - 1]);
  }, [qual]);

  const [notes, setNotes] = useState<Record<number, Notes>>({});
  useEffect(
    () =>
      setNotes(
        Object.assign(
          {},
          ...(matchResults?.redAlliance
            .concat(matchResults.blueAlliance || [])
            .map((value) => {
              return { [value]: defaultNotes };
            }) || [])
        )
      ),
    [matchResults?.redAlliance]
  );

  console.log(notes);

  const getTeamElement = (team: number) => {
    return (
      <TeamElement
        team={team}
        currentTeamNotes={notes[team] || defaultNotes}
        setTeamNotes={(message: Notes) =>
          setNotes({ ...notes, [team]: message })
        }
      />
    );
  };
  const teamElement = useMemo(() => team && getTeamElement(team), [team]);

  return (
    <>
      <div className="rower mt-10">
        <h1 className="text-2xl mr-3">Qual</h1>
        <input
          type="number"
          onChange={(event) => setQual(parseInt(event.target.value))}
          min={1}
          defaultValue={1}
        />
      </div>

      <div className="rower mt-10">
        <h1>Team Number</h1>
        <input
          type="number"
          onChange={(event) => setTeam(parseInt(event.target.value))}
        />
      </div>
      {teamElement}

      <div className="mt-10 bg-blue-900">
        {matchResults?.blueAlliance.map(getTeamElement)}
      </div>

      <div className="mt-10 bg-red-900">
        {matchResults?.redAlliance.map(getTeamElement)}
      </div>

      <button
        className="bg-green-800 px-12 py-6"
        onClick={() =>
          notes &&
          postNotes(notes, qual)
            .then(() => {
              alert("Successfuly Sent Notes");
            })
            .catch(() => alert("Couldn't Send Notes"))
        }
      >
        Submit
      </button>
    </>
  );
};

export default NoteTab;
