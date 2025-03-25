import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

async function getAccountByEmail(email: string) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  const [accountData] = await connection.query(
    "select * from ccca.account where email = $1",
    [email]
  );
  await connection.$pool.end();
  return accountData;
}

async function saveAccount(account: any) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      account.id,
      account.name,
      account.email,
      account.cpf,
      account.carPlate,
      !!account.isPassenger,
      !!account.isDriver,
      account.password,
    ]
  );
  await connection.$pool.end();
}

async function getAccountById(accountId: string) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  const [accountData] = await connection.query(
    "select * from ccca.account where account_id = $1",
    [accountId]
  );
  await connection.$pool.end();
  return accountData;
}

export async function signup(input: any) {
  input.id = crypto.randomUUID();
  const accountData = await getAccountByEmail(input.email);

  if (accountData) throw new Error("Duplicated account");
  if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
  if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
  if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
  if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
    throw new Error("Invalid car plate");
  await saveAccount(input);
  return { accountId: input.id };
}

export async function getAccount(accountId: any) {
  const accountData = await getAccountById(accountId);
  return accountData;
}
