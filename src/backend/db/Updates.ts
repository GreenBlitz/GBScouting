import { updateAllISAItems } from "./ISA.js";
import { updateAllTBAMatches } from "./TBA.js";

const oneSecond = 1000;
const fiveMinutes = 60 * 5 * oneSecond;
export function startConstantlyUpdating() {
  console.log("Started Updating DB for ISA");

  updateAllISAItems();
  setInterval(updateAllISAItems, fiveMinutes);

  updateAllTBAMatches();
}
