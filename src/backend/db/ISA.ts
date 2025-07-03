import axios from "axios";
import { PromisedFormsCollection } from "./DB.js";
import ISAScoutForm from "../../types/ISAScoutForm.js";
import dotenv from "dotenv";
import ISAtoGB from "../../utils/ISAtoGB.js";

dotenv.config();

const ISAToken = process.env.ISA_TOKEN || "";

const ISAUrl = "https://isa2025-api.liujip2020.workers.dev/public/robots/";
const itemConfig =
  "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

const fetchingURL = `${ISAUrl}json?include=${itemConfig}`;

function getAllItemsISA(): Promise<ISAScoutForm[]> {
  return axios
    .get(fetchingURL, {
      headers: {
        Authorization: `Bearer ${ISAToken}`,
      },
    })
    .then((response) => response.data);
}

export function updateAllISAItems() {
  return PromisedFormsCollection.then((collection) =>
    getAllItemsISA().then(async (items) => {
      if (items.length === 0) {
        return;
      }
      const existingData = await collection.find().toArray();
      if (existingData.length === items.length) {
        return;
      }
      collection.deleteMany();
      collection.insertMany(items.map(ISAtoGB));
    })
  );
}
