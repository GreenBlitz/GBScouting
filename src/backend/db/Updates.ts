import { updateAllISAItems } from "./ISA.js";
import { updateAllTBAMatches } from "./TBA.js";

const oneSecond = 1000;
const fiveMinutes = 60 * 5 * oneSecond;
export function startConstantlyUpdating() {
  console.log("Started Updating DB for ISA and TBA");

  update();
  setInterval(update, fiveMinutes);
}

function update() {
  updateAllISAItems();
  updateAllTBAMatches();
}
