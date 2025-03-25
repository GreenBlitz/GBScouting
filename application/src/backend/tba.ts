import { Express, Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

const currentDistrict = "2025iscmp";

export function applyRoutes(app: Express, dirName: string) {
  // Define routes
  app.get("/TBA/rankings", async (req, res) => {
    try {
      // Read API key from file
      const tbaKey = fs
        .readFileSync(path.resolve(dirName, "TBAkey.txt"), "utf8")
        .trim();

      // Set request headers
      const headers = {
        "X-TBA-Auth-Key": tbaKey,
        "Content-Type": "application/json",
      };

      // Fetch rankings from The Blue Alliance API
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/event/${currentDistrict}/rankings`,
        { headers }
      );

      // Send response back to the client
      res.json(response.data);
    } catch (error) {
      console.error("Error calling TBA API:", error);
      res.status(500).json({ error: "Failed to fetch qualification rankings" });
    }
  });

  app.get("/TBA/matches", async (req, res) => {
    try {
      // Read API key from file
      const tbaKey = fs
        .readFileSync(path.resolve(dirName, "TBAkey.txt"), "utf8")
        .trim();

      // Set request headers
      const headers = {
        "X-TBA-Auth-Key": tbaKey,
        "Content-Type": "application/json",
      };

      // Fetch rankings from The Blue Alliance API
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/event/${currentDistrict}/matches`,
        { headers }
      );

      // Send response back to the client
      res.json(response.data);
    } catch (error) {
      console.error("Error calling TBA API:", error);
      res.status(500).json({ error: "Failed to fetch qualification rankings" });
    }
  });

  app.get("/TBA/match/:matchNumber", async (req: Request, res: Response) => {
    try {
      const matchKey = currentDistrict + req.params.matchNumber; // Get match key from request

      // Read TBA API Key from file
      const tbaKey = fs
        .readFileSync(path.resolve(dirName, "TBAkey.txt"), "utf8")
        .trim();

      // Set headers for API request
      const headers = {
        "X-TBA-Auth-Key": tbaKey, // Authentication key
        "Content-Type": "application/json",
      };

      // Fetch match data from The Blue Alliance API
      const response = await axios.get(
        `https://www.thebluealliance.com/api/v3/match/${matchKey}`,
        { headers }
      );

      // Send the match result back to the frontend
      res.json(response.data);
    } catch (error) {
      console.error("Error calling TBA API:", error);
      res.status(500).json({ error: "Failed to fetch match results" });
    }
  });
}
