import React, { useEffect, useState } from "react";
import {
  autoBlueNotePositions,
  Match,
  Note,
} from "../Utils";
import AutoChart from "./charts/AutoChart";
import { width as autoMapWidth } from "../scouter/querytypes/AutoMap";

interface AutoTabProps {
  matches: Match[]
}

type NotePercenteges = [Note, number][];
type Accuracy = number;
type Auto = [NotePercenteges, number, Accuracy, Accuracy];

const speakerName = "Speaker/Auto";
function getAutos(matches: Match[]): Auto[] {
  const matchesNotes: Note[][] = matches.map((match) => {
    const notes: Note[] = JSON.parse(match["Automap/Notes"]);
    return notes.some(
      (note) => note.x === autoMapWidth - autoBlueNotePositions[0].x
    )
      ? notes.map((note) => {
          return {
            x: autoMapWidth - note.x,
            y: note.y,
            color: note.color,
          } as Note;
        })
      : notes;
  });

  const speakerData: [number, number][] = matches.map((match) => {
    return [parseInt(match[speakerName + "/Score"]), parseInt(match[speakerName + "/Miss"])];
  });

  const bitMap = matchesNotes.map((matchNotes) =>
    matchNotes.map((note) => note.color !== "orange")
  );
  function isBoolArraySame(arr1: boolean[], arr2: boolean[]) {
    return arr1.every((value, index) => value === arr2[index]);
  }

  //bro don't even try to debug from here on out
  const samiesIndexes: number[][] = [];
  bitMap.forEach((bools, boolsIndex) => {
    let isIn = false;
    samiesIndexes.forEach((samie) => {
      if (isBoolArraySame(bitMap[samie[0]], bools)) {
        isIn = true;
        samie.push(boolsIndex);
      }
    });
    if (!isIn) {
      samiesIndexes.push([boolsIndex]);
    }
  });

  const notePercenteges: NotePercenteges[] = samiesIndexes.map(
    (samieIndexes) => {
      const sums: [Note, number][] = matchesNotes[samieIndexes[0]].map(
        (note) => {
          return [note, 0];
        }
      );
      samieIndexes.forEach((samieIndex) => {
        matchesNotes[samieIndex].forEach((note, index) => {
          sums[index] = [
            note,
            sums[index][1] + (note.color === "green" ? 1 : 0),
          ];
        });
      });
      return sums.map(([note, sum]) => {
        return [note, sum / samieIndexes.length];
      });
    }
  );
  const speakerPercentages: [Accuracy, Accuracy][] = samiesIndexes.map(
    (samieIndexes) => {
      const sums: [number, number] = [0, 0];
      samieIndexes.forEach((samieIndex) => {
        sums[0] = sums[0] + speakerData[samieIndex][0];
        sums[1] = sums[1] + speakerData[samieIndex][1];
      });
      return [sums[0] / samieIndexes.length, sums[1] / samieIndexes.length];
    }
  );
  return notePercenteges.map((percentage, index) => [
    percentage,
    samiesIndexes[index].length,
    speakerPercentages[index][0],
    speakerPercentages[index][1],
  ]);
}

const AutoTab: React.FC<AutoTabProps> = ({matches}) => {
  const [autos, setAutos] = useState<Auto[]>([]);

  useEffect(() => {
    setAutos(getAutos(matches));
  }, [matches]);

  console.log(autos);

  return (
    <>
      {autos.map((auto, index) => (
        <div className="auto-chart" key={index}>
          <AutoChart notes={auto[0]} />
          <div>
            <h2>Times Done: {auto[1]}</h2>
            <h2>Speaker Score: {auto[2]}</h2>
            <h2>Speaker Miss: {auto[3]}</h2>
          </div>
        </div>
      ))}
    </>
  );
};
export default AutoTab;
