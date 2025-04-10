import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase } from "./AccountDAO";
import GetAccount from "./GetAccount";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO);
    const output = await signup.execute(input);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountDAO = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDAO);
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});

app.listen(3000);
