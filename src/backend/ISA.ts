import axios from "axios";
import { Router } from "express";
import PromisedDatabase from "./DB.js";
import ISAScoutForm from "../types/ISAScoutForm.js";
import dotenv from "dotenv";

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

function updateAllItemsISA() {
  return PromisedDatabase.then((db) =>
    getAllItemsISA().then((items) => {
      if (items.length === 0) {
        return;
      }
      const isaData = db.collection("isa/data");
      isaData.deleteMany();
      isaData.insertMany(items);
    })
  );
}

const router = Router();

export default router;
