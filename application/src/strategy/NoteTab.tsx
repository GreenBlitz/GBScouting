import React, { useEffect, useMemo, useState } from "react";
import { renderStrategyNavBar } from "../App";
import { fetchMatchResults, MatchResults } from "../utils/Fetches";

const NoteTab: React.FC = () => {
  const [qual, setQual] = useState<number>(0);

  const [matchResults, setMatchResults] = useState<MatchResults | null>(null);

  useEffect(() => {
    async function updateMatchResults() {
      setMatchResults(await fetchMatchResults(`2024isde2_qm${qual}`));
    }
    updateMatchResults();
  }, [qual]);

  const redAlliance = useMemo(
    () => matchResults?.redAlliance.map((value) => value.slice(3)),
    [matchResults]
  );
  const blueAlliance = useMemo(
    () => matchResults?.blueAlliance.map((value) => value.slice(3)),
    [matchResults]
  );

  const [notes, setNotes] = useState<Record<string, string>>();
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

  const getTeamElement = (team: string) => {
    return (
      <div className="mx-2 my-5">
        <h1 className="text-2xl">{team}</h1>
        <textarea
          className="h-24 bg-dark-card"
          onChange={(event) => {
            console.log(event.currentTarget.value);
            if (notes) notes[team] = event.currentTarget.value;
            setNotes(notes);
          }}
        />
      </div>
    );
  };

  return (
    <>
      {renderStrategyNavBar()}
      <div className="rower mt-10">
        <h1 className="text-2xl mr-3">Qual</h1>
        <input
          type="number"
          onChange={(event) => setQual(parseInt(event.target.value))}
          min={1}
        />
      </div>

      <div className="mt-10 bg-blue-900">
        {blueAlliance?.map(getTeamElement)}
      </div>

      <div className="mt-10 bg-red-900">{redAlliance?.map(getTeamElement)}</div>
    </>
  );
};
export default NoteTab;
