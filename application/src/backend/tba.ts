import { Express, Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { Db } from "mongodb";

const currentDistrict = "2025isios";

export function applyRoutes(app: Express, db: Db, dirName: string) {
  // Read API key from file
  const tbaKey = fs
    .readFileSync(path.resolve(dirName, "TBAkey.txt"), "utf8")
    .trim();
  const headers = {
    "X-TBA-Auth-Key": tbaKey,
    "Content-Type": "application/json",
  };

  const putClimbsInDatabase = async () => {
    const collection = db.collection("tba");

    const response = await axios.get(
      `https://www.thebluealliance.com/api/v3/event/${currentDistrict}/matches`,
      { headers }
    );

    const data: any[] = response.data;

    const climbingRobots = data
      .map((match) => ({
        red: {
          teams: match.alliances.red.team_keys as string[],
          climbs: [
            match.score_breakdown.red.endGameRobot1,
            match.score_breakdown.red.endGameRobot2,
            match.score_breakdown.red.endGameRobot3,
          ],
        },
        blue: {
          teams: match.alliances.blue.team_keys as string[],
          climbs: [
            match.score_breakdown.blue.endGameRobot1,
            match.score_breakdown.blue.endGameRobot2,
            match.score_breakdown.blue.endGameRobot3,
          ],
        },
        qual: match.comp_level === "qm" ? match.match_number : -1,
      }))
      .map((match) => ({
        red: Object.assign(
          {},
          ...match.red.teams.map((team, index) => ({
            [team.slice(3)]: match.red.climbs[index],
          }))
        ),
        blue: Object.assign(
          {},
          ...match.blue.teams.map((team, index) => ({
            [team.slice(3)]: match.blue.climbs[index],
          }))
        ),
        qual: match.qual,
      }));

    if (climbingRobots.length > 0) {
      collection.deleteMany();
      collection.insertMany(climbingRobots);
      console.log(
        "Updated the climbing: inserted " + climbingRobots.length + " matches"
      );
    }
  };

  // putClimbsInDatabase();
  // setInterval(putClimbsInDatabase, 60 * 1000 * 5);
  // Define routes
  app.get("/TBA/rankings", async (req, res) => {
    try {
      // Set request headers

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

  app.get("/TBA/climb", async (req, res) => {
    const tbaCollection = db.collection("tba");

    try {
      const matches = await tbaCollection.find().toArray();
      res.status(200).json(matches);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error retrieving notes" });
    }
  });

  app.get("/TBA/match/:matchNumber", async (req: Request, res: Response) => {
    try {
      const matchKey = currentDistrict + req.params.matchNumber; // Get match key from request

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
