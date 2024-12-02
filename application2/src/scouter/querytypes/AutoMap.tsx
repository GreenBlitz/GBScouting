import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Point } from "chart.js";
import { localStorageTabName } from "../ScouterQuery";
import { autoBlueNotePositions, autoNotePositions, Note } from "../../Utils";

interface AutoMapProps {
  side: "blue" | "red";
}
const noteRadius = 10;

export const width = 360 * 0.8;
export const height = 240;
const AutoMap: React.FC<AutoMapProps> = ({ side }) => {
  const localStorageKey = localStorageTabName + "Automap/Notes";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagePath =
    side === "blue"
      ? "./src/assets/Blue Auto Map.png"
      : "./src/assets/Red Auto Map.png";

  function getNotes(): Note[] {
    const newNotes: Note[] = autoNotePositions
      .concat(autoBlueNotePositions)
      .map((note) => {
        return {
          x: side === "blue" ? note.x * 0.8 : width - note.x * 0.8,
          y: note.y * 0.8,
          color: "orange",
        };
      });
    const previousSide =
      localStorage.getItem(localStorageTabName + "AutoMap/Side") || side;
    console.log(previousSide);
    const previousNotesJson = localStorage.getItem(localStorageKey);
    const previousNotes: Note[] = previousNotesJson
      ? JSON.parse(previousNotesJson)
      : newNotes;
    const notes = side != previousSide ? newNotes : previousNotes;
    return notes;
  }

  const [notes, setNotes] = useState<Note[]>(getNotes());

  function getClosestNote(position: Point) {
    let [min, closestNote]: [number, Note] = [
      100000,
      { x: 0, y: 0, color: "orange" },
    ];
    notes.forEach((note) => {
      const distanceSquared =
        (note.x - position.x) ** 2 + (note.y - position.y) ** 2;
      if (min > distanceSquared) {
        min = distanceSquared;
        closestNote = note;
      }
    });
    if (min > 30 ** 2) {
      return null;
    }
    return closestNote;
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const clickedPoint: Point = {
      x: event.pageX - event.currentTarget.offsetLeft,
      y: event.pageY - event.currentTarget.offsetTop,
    };
    const closestNote = getClosestNote(clickedPoint);
    if (!closestNote) {
      return;
    }
    if (closestNote.color === "orange") closestNote.color = "green";
    else if (closestNote.color === "green") {
      closestNote.color = "red";
    } else {
      closestNote.color = "orange";
    }
    setNotes(notes);
    drawNotes();
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
  }

  useEffect(() => {
    drawNotes();
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
    localStorage.setItem(localStorageTabName + "AutoMap/Side", side);
  }, [notes, canvasRef]);

  function drawNote(note: Note, context: CanvasRenderingContext2D) {
    if (!context) return;
    context.strokeStyle = note.color;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(note.x, note.y, noteRadius, 0, 2 * Math.PI);
    context.stroke();
  }

  function drawNotes() {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);
    notes.forEach((note) => drawNote(note, context));
  }

  return (
    <div
      style={{
        backgroundImage: 'url("' + imagePath + '")',
        backgroundSize: "100% 100%",
        width: width,
        height: height,
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
      />
    </div>
  );
};
export default AutoMap;
