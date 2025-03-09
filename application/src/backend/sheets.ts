import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const bbbMatchToMatch = (bbbMatch: Record<string, string>) => {
  try {const getClimb = () => {
    const success = bbbMatch["E_ClimbSuccess"] === "TRUE";
    const climb = bbbMatch["E_Climb"];

    if (climb === "DEEP") {
      return success ? "Deep Cage" : "Tried Deep";
    }
    if (climb === "SHALLOW" && success) {
      return "Shallow Cage";
    }

    return "Park";
  };
  return {
    scouterName: bbbMatch["D_ScouterName"],
    qual: parseInt(bbbMatch["D_MatchNumber"]),
    teamNumber: parseInt(bbbMatch["D_TeamNumber"].slice(0, 6).trim()),
    noShow: bbbMatch["D_Played"] === "FALSE",
    defense:
      bbbMatch["G_DefenceLevel"] === ""
        ? undefined
        : parseInt(bbbMatch["G_DefenceLevel"]),
    defensiveEvasion:
      bbbMatch["G_CopeWithDefence"] === ""
        ? undefined
        : parseInt(bbbMatch["G_CopeWithDefence"]),
    climb: getClimb(),
    comment: bbbMatch["G_Comments"],
    teleReefPick: {
      algea: {
        netScore: parseInt(bbbMatch["T_NetScored"]),
        netMiss: parseInt(bbbMatch["T_NetFailed"]),
        processor: parseInt(bbbMatch["T_ProcessorScored"]),
      },
      levels: {
        L1: {
          score: parseInt(bbbMatch["T_L1Scored"]),
          miss: parseInt(bbbMatch["T_L1Failed"]),
        },
        L2: {
          score: parseInt(bbbMatch["T_L2Scored"]),
          miss: parseInt(bbbMatch["T_L2Failed"]),
        },
        L3: {
          score: parseInt(bbbMatch["T_L3Scored"]),
          miss: parseInt(bbbMatch["T_L3Failed"]),
        },
        L4: {
          score: parseInt(bbbMatch["T_L4Scored"]),
          miss: parseInt(bbbMatch["T_L4Failed"]),
        },
      },
    },
    autoReefPick: {
      algea: {
        netScore: parseInt(bbbMatch["A_NetScored"]),
        netMiss: parseInt(bbbMatch["A_NetFailed"]),
        processor: 0,
      },
      levels: {
        L1: {
          score: parseInt(bbbMatch["A_L1Scored"]),
          miss: parseInt(bbbMatch["A_L1Failed"]),
        },
        L2: {
          score: parseInt(bbbMatch["A_L2Scored"]),
          miss: parseInt(bbbMatch["A_L2Failed"]),
        },
        L3: {
          score: parseInt(bbbMatch["A_L3Scored"]),
          miss: parseInt(bbbMatch["A_L3Failed"]),
        },
        L4: {
          score: parseInt(bbbMatch["A_L4Scored"]),
          miss: parseInt(bbbMatch["A_L4Failed"]),
        },
      },
    },
    endgameCollection: {
      algeaReefCollected: bbbMatch["G_AlgaeInReef"] === "Direct",
      algeaReefDropped: bbbMatch["G_AlgaeInReef"] === "Drop",
      algeaGroundCollected: bbbMatch["G_AlgaeFloorCollect"] === "TRUE",
      coralGroundCollected: bbbMatch["G_CoralFloorCollect"] === "TRUE",
      coralFeederCollected: false, //they don't collect this data
    },
  };}
  catch {
    return null;}
  
};

export function applyRoutes(app: Express, db: Db, dirName: string) {
  dotenv.config();

  // Load Service Account Key
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const KEY_FILE_PATH = path.join(dirName, "./sheets-key.json");

  // Google Authentication
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
  });
  // SSL options for HTTPS
  let spreadsheetId = "";
  try {
    spreadsheetId = fs
      .readFileSync(path.resolve(dirName, "sheets-id.txt"))
      .toString()
      .trim();
  } catch (exception) {
    console.log(exception);
  }

  console.log("SpreadSheet ID: " + spreadsheetId);

  const sheets = google.sheets({ version: "v4", auth });
  const getSheetData = async (range: string) => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values;
    } catch (error) {
      console.error("Error reading Google Sheet:", error);
      return null;
    }
  };

  const formatData = (data: string[][]) => {
    const keys = data[0];
    const recordValues: Record<string, string>[] = data
      .slice(1)
      .map((match) =>
        Object.assign(
          {},
          ...match.map((value, index) => ({ [keys[index]]: value }))
        )
      );

    return recordValues;
  };

  const updateData = async () => {
    const range = "RawData";
    const data = formatData(await getSheetData(range)).map(bbbMatchToMatch);

    const bbbCollection = db.collection("bbb");

    await bbbCollection
      .deleteMany({})
      .then(() => bbbCollection.insertMany(data));

    console.log("Updated Bumblebee Data");
    return data;
  };

  updateData(); // Initial call to start the loop
  setInterval(updateData, 5 * 60 * 1000); // Makes updateData happen every five minutes

  app.get("/beeascout", async (req: Request, res: Response) => {
    const bbbCollection = db.collection("bbb");
    const data = await bbbCollection.find().toArray();
    if (data) {
      res.json({ success: true, data });
    } else {
      res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
  });
}
