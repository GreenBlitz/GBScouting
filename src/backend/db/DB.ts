import { Collection, Db, MongoClient } from "mongodb";
import { GBScoutForm } from "../../types/GBScoutForm";

const mongoURI = "mongodb://0.0.0.0:27017/GBScouting";

const PromisedDatabase: Promise<Db> = MongoClient.connect(mongoURI).then(
  (client) => client.db("admin")
);

function collectionize<T extends {}>(name: string): Promise<Collection<T>> {
  return PromisedDatabase.then((db) => db.collection<T>(name));
}

export const PromisedFormsCollection =
  collectionize<GBScoutForm>("data/scoutForms");

export default PromisedDatabase;
