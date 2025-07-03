import dotenv from "dotenv";
import axios from "axios";
import { PromisedTBACollection } from "./DB.js";

dotenv.config();

const TBAToken = process.env.TBA_KEY || "";

const TBAUrl = "https://www.thebluealliance.com/api/v3/event/";
const currentEvent = "2025inmis";

const fetchingURL = `${TBAUrl}${currentEvent}/matches`;

function getAllMatchesTBA() {
  return axios
    .get(fetchingURL, {
      headers: {
        "X-TBA-Auth-Key": TBAToken,
      },
    })
    .then((response) => response.data);
}

export function updateAllTBAMatches() {
  return PromisedTBACollection.then((collection) =>
    getAllMatchesTBA().then(async (items) => {
      if (items.length === 0) {
        return;
      }
      const existingData = await collection.find().toArray();

      if (existingData.length === items.length) {
        return;
      }
      collection.deleteMany();
      collection.insertMany(items);
    })
  );
}
