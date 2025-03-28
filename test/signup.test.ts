import { getAccount, signup } from "../src/signup";

describe("signup", () => {
  test("should create a new passenger account", async () => {
    const input = {
      name: "john doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    const outputSignup = await signup(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount(outputSignup.accountId);
    expect(outputGetAccount).toEqual({
      account_id: outputSignup.accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      car_plate: null,
      is_passenger: true,
      is_driver: false,
      password: input.password,
    });
  });

  test("should not create a new passenger account with invalid name", async () => {
    const input = {
      name: "john",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    await expect(() => signup(input)).rejects.toThrow(
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
    await expect(() => signup(input)).rejects.toThrow(
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

    await expect(() => signup(input)).rejects.toThrow(new Error("Invalid cpf"));
  });

  test("should not create a new passenger when user already exists", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };
    await expect(() => signup(input)).rejects.toThrow(
      new Error("Duplicated account")
    );
  });

  test("should create a new driver account", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: false,
      isDriver: true,
      carPlate: "ABC1234",
      password: "0293490239043",
    };
    const outputSignup = await signup(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount(outputSignup.accountId);

    expect(outputGetAccount).toEqual({
      account_id: outputSignup.accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      car_plate: "ABC1234",
      is_passenger: false,
      is_driver: true,
      password: input.password,
    });
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
    await expect(() => signup(input)).rejects.toThrow(
      new Error("Invalid car plate")
    );
  });
});
