import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAllAwaitingMatches,
  MatchTeams,
  postNotes,
} from "../utils/Fetches";
import { StorageBacked } from "../utils/FolderStorage";

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
    console.log("ss");

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
    if (matches) setMatchResults(matches[qual]);
  }, [qual]);

  const [notes, setNotes] = useState<Record<number, string>>();
  useEffect(
    () =>
      setNotes(
        Object.assign(
          {},
          ...(matchResults?.redAlliance
            .concat(matchResults.blueAlliance || [])
            .map((value) => {
              return { [value]: "" };
            }) || [])
        )
      ),
    [matchResults?.redAlliance]
  );

  console.log(notes);

  const getTeamElement = (team: number) => {
    return (
      <div className="mx-2 my-5">
        <h1 className="text-2xl">{team}</h1>
        <textarea
          className="h-24 bg-dark-card"
          onChange={(event) => {
            if (notes) notes[team] = event.currentTarget.value;
            setNotes(notes);
          }}
        />
      </div>
    );
  };

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
      {team && getTeamElement(team)}

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
              alert("successfuly sent notes");
            })
            .catch(() => alert("couldn't send notes"))
        }
      >
        Submit
      </button>
    </>
  );
};
export default NoteTab;
