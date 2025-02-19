import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import { hash } from "argon2";

export interface AccountAuth {
  username: string;
  hashedPassword: string;
}

export interface Account extends AccountAuth {}
export interface AccountData extends Account {}

export function applyRoutes(app: Express, db: Db) {
  // Define routes

  const accountCollection = db.collection("accounts");

  app.post(
    "/account/create",
    async (req: Request<any, any, Account>, res: Response) => {
      if (!req.body.username) {
        return res.status(400).send("Invalid Paramaters");
      }

      try {
        if (
          accountCollection.find(
            (value) => value.username === req.body.username
          )
        ) {
          return res.status(400).send("Account Already Exists");
        }

        const reHashedPassword = await hash(req.body.hashedPassword);
        const savedAccount: Account = {
          ...req.body,
          hashedPassword: reHashedPassword,
        };

        accountCollection.insertOne(savedAccount);
        res.status(201).send("Account Created");
      } catch (error) {
        res.status(500).json({ error: "Failed to insert data" });
      }
    }
  );

  app.get(
    "/account/login",
    async (req: Request<any, any, AccountAuth>, res: Response) => {
      if (!req.body.username) {
        return res.status(400).send("Invalid Paramaters");
      }
      const reHashedPassword = await hash(req.body.hashedPassword);

      try {
        const savedAccount = await accountCollection.find(
          (value) => value.username === req.body.username
        ).toArray()[0];

        if (savedAccount.hashedPassword !== reHashedPassword) {
          res.status(400).send("Wrong Password or Username");
        }

      } catch (error) {
        res.status(500).send(error);
      }
    }
  );
}
