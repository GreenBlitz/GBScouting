import { Db, MongoClient } from "mongodb";

const mongoURI = "mongodb://0.0.0.0/27017";

const PromisedDatabase: Promise<Db> = MongoClient.connect(mongoURI).then(
  (client) => client.db("admin")
);

export default PromisedDatabase;
