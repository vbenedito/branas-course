import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  // const accountDAO = new AccountDAODatabase();
  const accountDAO = new AccountDAOMemory();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
});

describe("signup", () => {
  test("should create a new passenger account", async () => {
    const input = {
      name: "john doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  });

  test("should not create a new passenger account with invalid name", async () => {
    const input = {
      name: "john",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error("Invalid name")
    );
  });

  test("should not create a new passenger account with invalid email", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error("Invalid email")
    );
  });

  test("should not create a new passenger account with invalid CPF", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "12934",
      isPassenger: true,
      password: "0293490239043",
    };

    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error("Invalid cpf")
    );
  });

  test("should not create a new passenger when user already exists", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error("Duplicated account")
    );
  });

  test("should not create a new driver account with invalid car plate", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: false,
      isDriver: true,
      carPlate: "12883",
      password: "0293490239043",
    };
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error("Invalid car plate")
    );
  });
});
