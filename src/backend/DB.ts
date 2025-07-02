import { Db, MongoClient } from "mongodb";

const mongoURI = "mongodb://0.0.0.0/27017";

const PromisedDatabase: Promise<Db> = MongoClient.connect(mongoURI).then(
  (client) => client.db("admin")
);

function collectionize(name: string) {
  return PromisedDatabase.then((db) => db.collection(name));
}

export const PromisedFormsCollection = collectionize("data/scoutForms");

export default PromisedDatabase;
