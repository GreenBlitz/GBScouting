import { Router } from "express";
import { PromisedFormsCollection, PromisedTBACollection } from "../db/DB.js";
import {
  addRobotAbilities,
  defaultRobotAbilities,
  defaultRobotAbility,
  RobotAbilities,
  RobotAbility,
} from "../../types/RobotAbilities.js";
import { didTeamClimb, isTeamInGame } from "../../types/TBAMatch.js";

const router = Router();

router.get("/abilities/:team", (req, res) => {
  const teamNumber = parseInt(req.params.team);
  const teamForms = PromisedFormsCollection.then((collection) =>
    collection.find({ "preMatch.teamNumber": teamNumber }).toArray()
  );
  const robotAbilitiesWithoutClimb = teamForms.then((forms) =>
    forms.reduce(
      (acc, form) => addRobotAbilities(acc, form),
      defaultRobotAbilities
    )
  );

  const tbaMatches = PromisedTBACollection.then((collection) =>
    collection.find().toArray()
  ).then((allMatches) =>
    allMatches.filter((match) => isTeamInGame(match, teamNumber))
  );

  const climbs = tbaMatches.then((matches) =>
    matches.map((match) => didTeamClimb(match, teamNumber))
  );

  const climbAbility: Promise<RobotAbility> = climbs.then((climbArr) =>
    climbArr.reduce(
      (acc, climb) => ({
        succeeded: acc.succeeded + Number(climb),
        failed: acc.failed + 1 - Number(climb),
      }),
      defaultRobotAbility
    )
  );
  Promise.all([robotAbilitiesWithoutClimb, climbAbility]).then(
    ([abilities, climb]) =>
      res.status(200).json({ ...abilities, deepCage: climb } as RobotAbilities)
  );
});

export default router;
