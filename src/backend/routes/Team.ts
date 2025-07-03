import { Router } from "express";
import { PromisedFormsCollection } from "../db/DB.js";
import {
  addRobotAbilities,
  defaultRobotAbilities,
} from "../../types/RobotAbilities.js";

const router = Router();

router.get("/abilities/:team", (req, res) => {
  const teamForms = PromisedFormsCollection.then((collection) =>
    collection
      .find({ "preMatch.teamNumber": parseInt(req.params.team) })
      .toArray()
  );
  const robotAbilities = teamForms.then((forms) =>
    forms.reduce(
      (acc, form) => addRobotAbilities(acc, form),
      defaultRobotAbilities
    )
  );
  robotAbilities.then((items) => res.status(200).json(items));
});

export default router;
