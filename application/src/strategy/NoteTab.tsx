import React, { useEffect, useMemo, useState } from "react";
import { fetchMatchResults, MatchResults, postNotes } from "../utils/Fetches";

const NoteTab: React.FC = () => {
  const [qual, setQual] = useState<number>(1);

  const [matchResults, setMatchResults] = useState<MatchResults | null>(null);

  const [team, setTeam] = useState<number | null>(null);

  useEffect(() => {
    async function updateMatchResults() {
      setMatchResults(await fetchMatchResults(""));
    }
    updateMatchResults();
  }, [qual]);

  const toTeamNumber = (value: string) => parseInt(value.slice(3));
  const redAlliance = useMemo(
    () => matchResults?.redAlliance.map(toTeamNumber),
    [matchResults]
  );
  const blueAlliance = useMemo(
    () => matchResults?.blueAlliance.map(toTeamNumber),
    [matchResults]
  );

  const [notes, setNotes] = useState<Record<number, string>>();
  useEffect(
    () =>
      setNotes(
        Object.assign(
          {},
          ...(redAlliance?.concat(blueAlliance || []).map((value) => {
            return { [value]: "" };
          }) || [])
        )
      ),
    [redAlliance]
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
        {blueAlliance?.map(getTeamElement)}
      </div>

      <div className="mt-10 bg-red-900">{redAlliance?.map(getTeamElement)}</div>

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
