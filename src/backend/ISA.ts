import axios from "axios";
import { Router } from "express";
import PromisedDatabase from "./DB.js";

const ISAToken = ""

const ISAUrl = "https://isa2025-api.liujip2020.workers.dev/public/robots/";
const itemConfig =
  "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

const fetchingURL = `${ISAUrl}json?include=${itemConfig}&token=${ISAToken}`;

function getAllItems(): Promise<any> {
  return axios.get(fetchingURL).then((response) => response.data);
}

const router = Router();

router.get("/", async (_, res) => {
  PromisedDatabase.then((db) =>
    getAllItems().then((items) => {
      if (items.length === 0) {
        res.status(404).send("No items found");
        return;
      }
      const isaData = db.collection("isa/data");
      isaData.deleteMany();
      isaData.insertMany(items);
      res.status(200).send("Replaced Items");
    })
  );
});

export default router;
