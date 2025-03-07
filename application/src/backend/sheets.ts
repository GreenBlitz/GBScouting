import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import path from "path";

export function applyRoutes(app: Express, db: Db) {
  console.log("sheet1");

  dotenv.config();

  // Load Service Account Key
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const KEY_FILE_PATH = path.join(__dirname, "../../sheets-key.json");

  // Google Authentication
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
  });
  console.log("sheet2");

  const sheets = google.sheets({ version: "v4", auth });
  const getSheetData = async (spreadsheetId: string, range: string) => {
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

  app.get("/sheet", async (req, res) => {
    const spreadsheetId = ""; // Get from Google Sheets URL
    const range = "Sheet1!A1:C10"; // Adjust the range

    const data = await getSheetData(spreadsheetId, range);
    if (data) {
      res.json({ success: true, data });
    } else {
      res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
  });
}
