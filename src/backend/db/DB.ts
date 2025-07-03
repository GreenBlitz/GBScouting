import { Collection, Db, MongoClient } from "mongodb";
import { GBScoutForm } from "../../types/GBScoutForm.js";
import { TBAMatch } from "../../types/TBAMatch.js";

const mongoURI = "mongodb://0.0.0.0:27017/GBScouting";

const PromisedDatabase: Promise<Db> = MongoClient.connect(mongoURI).then(
  (client) => client.db("GBScouting")
);

function collectionize<T extends {}>(name: string): Promise<Collection<T>> {
  return PromisedDatabase.then((db) => db.collection<T>(name));
}

export const PromisedFormsCollection =
  collectionize<GBScoutForm>("data/scoutForms");

export const PromisedTBACollection = collectionize<TBAMatch>("data/tbaMatches");
