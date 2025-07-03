import { Router } from "express";
import { PromisedFormsCollection } from "./DB.js";
import {
  addRobotAbilities,
  defaultRobotAbilities,
} from "../types/RobotAbilities.js";
import { GBForm } from "../utils/GBForm.js";

const router = Router();

router.get("/abilities/:team", async (req, res) => {
  PromisedFormsCollection.then((collection) =>
    collection
      .find({ "preMatch.teamNumber": parseInt(req.params.team) })
      .toArray()
  )
    .then((forms) =>
      forms.reduce(
        (acc, form) => addRobotAbilities(acc, new GBForm(form)),
        defaultRobotAbilities
      )
    )
    .then((items) => res.status(200).json(items));
});

export default router;
