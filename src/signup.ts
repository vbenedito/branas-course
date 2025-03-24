import crypto from "crypto";
import pgp from "pg-promise";
import express, { Response } from "express";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

function returnErrorStatusWithMessage(res: Response, message: number) {
  res.status(422).json({ message });
}

function userAlreadyExists(account: any, res: Response) {
  if (account) {
    returnErrorStatusWithMessage(res, -4);
    return true;
  }

  return false;
}

function validateRegex(value: string, regex: RegExp) {
  return value.match(regex);
}

async function createDriverAccount(
  input: any,
  res: Response,
  connection: any,
  id: any
) {
  if (!validateRegex(input.carPlate, /[A-Z]{3}[0-9]{4}/)) {
    returnErrorStatusWithMessage(res, -5);
    return;
  }
  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      id,
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      !!input.isPassenger,
      !!input.isDriver,
      input.password,
    ]
  );

  const obj = {
    accountId: id,
  };
  return obj;
}

async function createPassengerAccount(input: any, connection: any, id: any) {
  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      id,
      input.name,
      input.email,
      input.cpf,
      null,
      !!input.isPassenger,
      !!input.isDriver,
      input.password,
    ]
  );
  const obj = {
    accountId: id,
  };
  return obj;
}

app.post("/signup", async function (req, res) {
  const input = req.body;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const id = crypto.randomUUID();
    let result;
    const [acc] = await connection.query(
      "select * from ccca.account where email = $1",
      [input.email]
    );

    if (userAlreadyExists(acc, res)) return;

    if (!validateRegex(input.name, /[a-zA-Z] [a-zA-Z]+/)) {
      returnErrorStatusWithMessage(res, -3);
      return;
    }

    if (!validateRegex(input.email, /^(.+)@(.+)$/)) {
      returnErrorStatusWithMessage(res, -2);
      return;
    }

    if (!validateCpf(input.cpf)) {
      returnErrorStatusWithMessage(res, -1);
      return;
    }

    if (input.isDriver) {
      result = await createDriverAccount(input, res, connection, id);
    } else {
      result = await createPassengerAccount(input, connection, id);
    }

    if (typeof result === "number") {
      res.status(422).json({ message: result });
    } else {
      res.json(result);
    }
  } finally {
    await connection.$pool.end();
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  const [accountData] = await connection.query(
    "select * from ccca.account where account_id = $1",
    [req.params.accountId]
  );
  await connection.$pool.end();
  res.json(accountData);
});

app.listen(3000);
